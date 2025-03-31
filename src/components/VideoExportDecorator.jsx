// --- START OF REFACTORED FILE VideoExportDecorator_PngSequence.jsx ---

import React, { useEffect, useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

console.log('VideoExportDecorator Module Loaded (PNG Sequence Export)');

// --- Constants ---
const DEFAULT_CAPTURE_FPS = 15;  // 降低默认帧率
const DEFAULT_RECORDING_DURATION_S = 5; // Default duration to capture in seconds
const FILENAME_PREFIX = 'animation_frames';
const ZIP_FILENAME = 'exported_frames.zip';
const TEST_MODE = false; // 测试模式开关：启用时跳过实际动画元素捕获，生成测试图像
const DEBUG_MODE = true; // 调试模式，显示详细日志
const MAX_FRAMES = 100;  // 最大帧数限制

/**
 * VideoExportDecorator - Exports a DIV's animation as a sequence of PNGs in a ZIP.
 */
const VideoExportDecoratorPngSequence = () => {
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0); 
    const [statusMessage, setStatusMessage] = useState('Export PNG Sequence');
    const [captureSettings, setCaptureSettings] = useState({
        fps: DEFAULT_CAPTURE_FPS,
        duration: DEFAULT_RECORDING_DURATION_S
    });

    const exportButtonRef = useRef(null);
    const targetElementRef = useRef(null);
    const capturedFramesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const lastCaptureTimeRef = useRef(0);
    const startTimeRef = useRef(0);
    const frameCounterRef = useRef(0);
    const exportButtonAddedRef = useRef(false);
    const totalFramesToCapture = useRef(captureSettings.duration * captureSettings.fps);
    const captureInProgressRef = useRef(false);
    const captureResetProtectionTimerRef = useRef(null); // 添加重置保护定时器
    
    // For progressive quality settings
    const qualitySettingsRef = useRef({
        scale: 1,        // Scale factor for html2canvas 
        compression: 6,  // Compression level for ZIP
        quality: 0.95    // PNG quality (0.0-1.0)
    });

    // --- DOM Interaction (find element, add button, update button state) ---

    const findTargetElement = useCallback(() => {
        console.log("Searching for target element...");
        
        // Try different selectors in case the demo-container class isn't found
        const selectors = [
            '.demo-container',
            '.chakra-tabs__tab-panel--selected > div',
            '.chakra-tabs__tab-panel[aria-selected="true"] > div',
            '.chakra-tabs__tab-panel:not([hidden]) > div',
            '.chakra-modal__content',
            '.css-y7bz0t' // 可能的自定义容器class
        ];
        
        let targetElement = null;
        
        // Try each selector
        for (const selector of selectors) {
            console.log(`Trying selector: ${selector}`);
            const containers = document.querySelectorAll(selector);
            console.log(`Found ${containers.length} elements with selector "${selector}"`);
            
            for (const container of containers) {
                if (container.offsetParent !== null && container.offsetWidth > 0 && container.offsetHeight > 0) {
                    targetElement = container;
                    console.log(`Found visible element with selector "${selector}"`);
                    break;
                }
            }
            
            if (targetElement) break;
        }
        
        if (!targetElement) {
            console.warn('Could not find any visible target element.');
            return null;
        }
        
        if (!targetElement.id) {
            targetElement.id = `demo-container-${Math.random().toString(36).substring(2, 9)}`;
        }
        
        console.log(`Selected target element: id=${targetElement.id}, width=${targetElement.offsetWidth}, height=${targetElement.offsetHeight}`);
        
        if (targetElement.offsetWidth === 0 || targetElement.offsetHeight === 0) {
            console.error("Target element has zero dimensions.");
            setStatusMessage("Target Size Error");
            return null;
        }
        
        return targetElement;
    }, []);

    const updateButtonState = useCallback(() => {
        if (!exportButtonRef.current) return;
        let text = statusMessage;
        let disabled = isExporting;

        if (isExporting) {
            if (statusMessage.startsWith('Capturing')) {
                text = `Capturing... ${progress}/${totalFramesToCapture.current}`;
            } else {
                text = statusMessage;
            }
        }

        exportButtonRef.current.textContent = text;
        exportButtonRef.current.disabled = disabled;
        exportButtonRef.current.style.opacity = disabled ? '0.5' : '0.7';
    }, [isExporting, progress, statusMessage]);

    const addExportButton = useCallback(() => {
        if (exportButtonAddedRef.current || document.getElementById('custom-export-button-png')) {
            if (!exportButtonRef.current) {
                exportButtonRef.current = document.getElementById('custom-export-button-png');
                if (exportButtonRef.current) {
                    exportButtonRef.current.removeEventListener('click', handleExportClick);
                    exportButtonRef.current.addEventListener('click', handleExportClick);
                }
            }
            updateButtonState();
            return;
        }

        const tabList = document.querySelector(".chakra-tabs__tablist");
        if (!tabList) return;

        console.log('Creating Export PNG Sequence button.');
        const button = document.createElement('button');
        button.id = 'custom-export-button-png';
        button.className = 'chakra-tabs__tab css-5wq6w1';
        button.textContent = statusMessage;
        button.style.opacity = '0.7';
        button.style.cursor = 'pointer';
        button.type = 'button';

        button.addEventListener('click', handleExportClick);
        button.addEventListener('mouseenter', () => { if (!button.disabled) button.style.opacity = '1'; });
        button.addEventListener('mouseleave', () => { if (!button.disabled) button.style.opacity = '0.7'; });

        // Insert as 4th tab
        const tabs = tabList.querySelectorAll('button.chakra-tabs__tab');
        const insertIndex = 3;
        if (tabs.length >= insertIndex) {
            tabList.insertBefore(button, tabs[insertIndex]);
        } else {
            tabList.appendChild(button);
        }

        exportButtonRef.current = button;
        exportButtonAddedRef.current = true;
        updateButtonState();
    }, [updateButtonState, statusMessage]);

    // --- PNG Capture Logic ---

    const cleanupCapture = useCallback(() => {
        console.log('Cleaning up PNG capture resources...');
        
        // 清除保护定时器
        if (captureResetProtectionTimerRef.current) {
            clearInterval(captureResetProtectionTimerRef.current);
            captureResetProtectionTimerRef.current = null;
        }
        
        // Don't clean up if we're currently capturing
        if (captureInProgressRef.current) {
            console.log('Skipping cleanup because capture is in progress');
            return;
        }
        
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        
        // Release memory
        if (capturedFramesRef.current.length > 0) {
            // Release blob URLs if any were created
            capturedFramesRef.current.forEach(blob => {
                if (blob instanceof Blob && blob._url) {
                    URL.revokeObjectURL(blob._url);
                }
            });
        }
        
        capturedFramesRef.current = [];
        lastCaptureTimeRef.current = 0;
        startTimeRef.current = 0;
        frameCounterRef.current = 0;
        
        setProgress(0);
        setIsExporting(false);
    }, []);

    const captureFrameSimplified = useCallback(async (element) => {
        try {
            console.log(`开始捕获元素: id=${element.id}, size=${element.offsetWidth}x${element.offsetHeight}`);
            
            // 记录开始时间
            const startFrameTime = performance.now();
            
            try {
                // 创建canvas
                const canvas = document.createElement('canvas');
                canvas.width = element.offsetWidth;
                canvas.height = element.offsetHeight;
                
                console.log(`创建canvas: size=${canvas.width}x${canvas.height}`);
                
                // 使用html2canvas简化版配置
                const result = await html2canvas(element, {
                    canvas: canvas,
                    backgroundColor: 'transparent', // 确保透明背景
                    logging: false,
                    useCORS: true,
                    scale: 1,
                    allowTaint: true,
                    removeContainer: true,
                    foreignObjectRendering: false, // 禁用foreignObject渲染以避免跨域问题
                    ignoreElements: (node) => {
                        // 忽略一些可能导致问题的元素
                        return node.nodeName === 'IFRAME' || 
                               node.nodeName === 'VIDEO' || 
                               node.classList.contains('ignore-export');
                    }
                });
                
                console.log(`html2canvas渲染完成: size=${result.width}x${result.height}`);
                console.log(`帧捕获耗时: ${performance.now() - startFrameTime}ms`);
                
                // 转换为blob
                return new Promise((resolve, reject) => {
                    console.log('开始转换Canvas为Blob...');
                    canvas.toBlob((blob) => {
                        if (blob) {
                            console.log(`Blob创建成功: size=${blob.size} bytes`);
                            resolve(blob);
                        } else {
                            console.error('Blob创建失败');
                            reject(new Error("Failed to create blob from canvas"));
                        }
                    }, 'image/png', qualitySettingsRef.current.quality);
                });
            } catch (canvasError) {
                console.error('Canvas操作失败:', canvasError);
                throw canvasError;
            }
        } catch (error) {
            console.error("捕获帧过程中错误:", error);
            throw error;
        }
    }, []);

    const downloadZipWithFrames = useCallback(async (frames, padding) => {
        try {
            // Create a loading indicator to show packaging progress
            const loadingIndicator = document.createElement('div');
            loadingIndicator.style.position = 'fixed';
            loadingIndicator.style.top = '50%';
            loadingIndicator.style.left = '50%';
            loadingIndicator.style.transform = 'translate(-50%, -50%)';
            loadingIndicator.style.background = 'rgba(0, 0, 0, 0.7)';
            loadingIndicator.style.color = 'white';
            loadingIndicator.style.padding = '20px';
            loadingIndicator.style.borderRadius = '10px';
            loadingIndicator.style.zIndex = '9999';
            loadingIndicator.textContent = 'Creating ZIP file...';
            document.body.appendChild(loadingIndicator);

            // Handle ZIP creation in batches to avoid UI freezing
            const zip = new JSZip();
            
            // Process in batches of 10 frames
            const BATCH_SIZE = 10;
            const batches = Math.ceil(frames.length / BATCH_SIZE);
            
            for (let batch = 0; batch < batches; batch++) {
                const start = batch * BATCH_SIZE;
                const end = Math.min(start + BATCH_SIZE, frames.length);
                
                // Update loading indicator
                loadingIndicator.textContent = `Creating ZIP file... ${Math.round((batch / batches) * 100)}%`;
                
                // Process batch
                for (let i = start; i < end; i++) {
                    const frameNumber = String(i + 1).padStart(padding, '0');
                    zip.file(`${FILENAME_PREFIX}_${frameNumber}.png`, frames[i]);
                }
                
                // Allow UI to update between batches
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            // Use better compression for final ZIP
            loadingIndicator.textContent = 'Compressing ZIP file...';
            const zipBlob = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: qualitySettingsRef.current.compression
                }
            }, (metadata) => {
                loadingIndicator.textContent = `Compressing ZIP: ${Math.round(metadata.percent)}%`;
            });

            console.log(`ZIP file created. Size: ${zipBlob.size} bytes`);
            loadingIndicator.textContent = 'Download starting...';
            
            // Trigger download
            saveAs(zipBlob, ZIP_FILENAME);
            
            // Clean up loading indicator
            document.body.removeChild(loadingIndicator);
            
            return true;
        } catch (error) {
            console.error("Error in ZIP download:", error);
            return false;
        }
    }, []);

    const finishAndPackage = useCallback(async () => {
        if (capturedFramesRef.current.length === 0) {
            console.error("No frames were captured.");
            alert("Export failed: No frames were captured. Check console for errors during capture.");
            setStatusMessage('Capture Failed');
            captureInProgressRef.current = false;
            cleanupCapture();
            return;
        }

        console.log(`Captured ${capturedFramesRef.current.length} frames. Starting ZIP packaging.`);
        setStatusMessage('Zipping...');
        setIsExporting(true);
        updateButtonState();

        try {
            const padding = String(totalFramesToCapture.current).length;
            const downloadSuccess = await downloadZipWithFrames(capturedFramesRef.current, padding);
            
            if (downloadSuccess) {
                setStatusMessage('Export Complete!');
                
                // Show FFmpeg instructions after download starts
                setTimeout(() => {
                    alert(`Export successful! ZIP file '${ZIP_FILENAME}' downloaded.\n\nTo create a transparent video using FFmpeg, navigate to the extracted folder in your terminal and run a command like:\n\nffmpeg -framerate ${captureSettings.fps} -i ${FILENAME_PREFIX}_%0${padding}d.png -c:v qtrle -alpha_pred 1 output_transparent.mov\n\n(This creates a QuickTime Animation file, good for editing software.)\n\nAlternatively for WebM/VP9:\nffmpeg -framerate ${captureSettings.fps} -i ${FILENAME_PREFIX}_%0${padding}d.png -c:v libvpx-vp9 -pix_fmt yuva420p -lossless 1 output_transparent.webm`);
                }, 500);
            } else {
                setStatusMessage('Download Failed');
                alert("Failed to download ZIP file. Check console for errors.");
            }
        } catch (error) {
            console.error("Error creating ZIP file:", error);
            alert(`Failed to create ZIP file: ${error.message}`);
            setStatusMessage('Zipping Failed');
        } finally {
            captureInProgressRef.current = false;
            cleanupCapture();
            setTimeout(() => {
                if (!isExporting) {
                    setStatusMessage('Export PNG Sequence');
                    updateButtonState();
                }
            }, 3000);
        }

    }, [cleanupCapture, updateButtonState, captureSettings.fps, downloadZipWithFrames]); 

    // 简化的捕获流程，使用等待循环而不是requestAnimationFrame
    const captureFramesSequentially = useCallback(async () => {
        try {
            console.log("开始顺序帧捕获...状态:", isExporting, captureInProgressRef.current);
            
            // 不依赖React状态，使用函数参数中的标志
            const internalExporting = true; // 强制使用内部状态
            
            setStatusMessage('捕获中...');
            
            // 如果是测试模式，不需要检查目标元素
            if (!TEST_MODE) {
                const element = targetElementRef.current;
                if (!element) {
                    console.error("目标元素丢失!");
                    setStatusMessage('目标元素丢失');
                    captureInProgressRef.current = false;
                    setIsExporting(false);
                    return;
                }
            }
            
            const frameDelay = 1000 / captureSettings.fps;
            const totalFrames = TEST_MODE ? 3 : totalFramesToCapture.current;
            
            console.log(`准备捕获 ${totalFrames} 帧，每帧延迟: ${frameDelay}ms`);
            console.log(`是否测试模式: ${TEST_MODE ? '是' : '否'}`);
            
            if (!TEST_MODE) {
                const element = targetElementRef.current;
                console.log(`目标元素再次确认: id=${element.id}, width=${element.offsetWidth}, height=${element.offsetHeight}`);
            } else {
                console.log("测试模式：不需要目标元素");
            }
            
            // 防止状态被其他地方重置
            const localCaptureFlag = { value: true };
            
            // 清空并初始化捕获状态
            capturedFramesRef.current = [];
            frameCounterRef.current = 0;
            
            // 非测试模式的代码 - 实际捕获
            console.log("开始实际捕获，创建本地变量保存状态");
            
            // 使用本地变量来跟踪状态，避免闭包问题
            let capturing = true;
            let frameCounter = 0;
            const capturedFrames = [];
            
            // 创建一个函数用于定期检查捕获标志
            const updateCaptureFlag = () => {
                // 如果全局捕获标志被重置，进行恢复
                if (!captureInProgressRef.current && localCaptureFlag.value) {
                    console.log("捕获标志被意外重置，通过保护机制恢复");
                    captureInProgressRef.current = true;
                }
                
                // 确保React状态与捕获标志同步
                if (!isExporting && captureInProgressRef.current) {
                    console.log("React状态与捕获标志不同步，更新React状态");
                    setIsExporting(true);
                }
            };
            
            // 设置定期检查和恢复捕获标志
            const flagCheckIntervalId = setInterval(updateCaptureFlag, 100);
            
            console.log("开始帧循环");
            for (let i = 0; i < totalFrames && capturing && localCaptureFlag.value; i++) {
                // 在每一帧开始时再次检查状态
                if (DEBUG_MODE) {
                    console.log(`帧 ${i+1} 检查状态: internalExporting=${internalExporting}, captureInProgress=${captureInProgressRef.current}, localFlag=${localCaptureFlag.value}, reactState=${isExporting}`);
                }
                
                // 检查中断标志 - 使用本地标志，不依赖ref
                if (!localCaptureFlag.value) {
                    console.log("捕获已取消(本地标志)。停止中...");
                    capturing = false;
                    break;
                }
                
                // 确保全局标志与本地同步
                captureInProgressRef.current = localCaptureFlag.value;
                
                const startTime = performance.now();
                
                try {
                    console.log(`尝试捕获帧 ${i+1}/${totalFrames}`);
                    let blob;
                    
                    if (TEST_MODE) {
                        // 测试模式下创建测试帧
                        const testCanvas = document.createElement('canvas');
                        testCanvas.width = 400;
                        testCanvas.height = 300;
                        const ctx = testCanvas.getContext('2d');
                        
                        // 绘制测试内容，每帧颜色不同
                        const colors = ['red', 'green', 'blue', 'purple', 'orange'];
                        ctx.fillStyle = colors[i % colors.length];
                        ctx.fillRect(0, 0, 400, 300);
                        
                        // 绘制帧号
                        ctx.fillStyle = 'white';
                        ctx.font = '24px Arial';
                        ctx.fillText(`测试帧 ${i+1}/${totalFrames}`, 50, 150);
                        
                        // 转换为blob
                        blob = await new Promise((resolve) => {
                            testCanvas.toBlob((b) => resolve(b), 'image/png');
                        });
                        
                        console.log(`测试帧 ${i+1} 创建成功: ${blob.size} bytes`);
                    } else {
                        // 实际模式下捕获真实元素
                        const element = targetElementRef.current;
                        blob = await captureFrameSimplified(element);
                    }
                    
                    console.log(`帧 ${i+1} 捕获成功: ${blob.size} bytes`);
                    
                    // 使用本地变量
                    capturedFrames.push(blob);
                    frameCounter = i + 1;
                    
                    // 同时更新React状态（不依赖这些更新来控制循环）
                    capturedFramesRef.current = capturedFrames;
                    frameCounterRef.current = frameCounter;
                    setProgress(frameCounter);
                    
                    // 更新状态消息，显示进度
                    setStatusMessage(`捕获中 ${frameCounter}/${totalFrames}`);
                    
                    // 每5帧记录一次进度
                    if (i % 5 === 0) {
                        const elapsed = performance.now() - startTimeRef.current;
                        const remaining = (elapsed / (i + 1)) * (totalFrames - i - 1);
                        console.log(`已捕获 ${i+1}/${totalFrames} 帧。剩余估计时间: ${Math.round(remaining/1000)}秒`);
                    }
                } catch (error) {
                    console.error(`帧 ${i+1} 捕获错误:`, error);
                    // 继续尝试下一帧
                }
                
                // 计算剩余的延迟时间
                const elapsedTime = performance.now() - startTime;
                const sleepTime = Math.max(0, frameDelay - elapsedTime);
                
                if (sleepTime > 0 && i < totalFrames - 1) {
                    console.log(`等待下一帧 ${i+2}: ${sleepTime}ms`);
                    await new Promise(resolve => setTimeout(resolve, sleepTime));
                }
            }
            
            // 清除检查间隔
            clearInterval(flagCheckIntervalId);
            
            console.log(`捕获完成。获取了 ${capturedFrames.length}/${totalFrames} 帧`);
            
            // 确保状态同步
            capturedFramesRef.current = capturedFrames;
            frameCounterRef.current = frameCounter;
            
            if (capturedFrames.length > 0) {
                console.log("有帧可用，开始打包");
                finishAndPackage();
            } else {
                console.log("没有捕获到任何帧");
                setStatusMessage('未捕获任何帧');
                captureInProgressRef.current = false;
                setIsExporting(false);
            }
        } catch (error) {
            console.error("顺序捕获过程中错误:", error);
            alert(`捕获错误: ${error.message}`);
            captureInProgressRef.current = false;
            setIsExporting(false);
            setStatusMessage('捕获失败');
        }
    }, [captureSettings.fps, captureFrameSimplified, finishAndPackage]);

    // Function to prompt user for settings
    const promptForSettings = useCallback(() => {
        // 创建一个简单的对话框，而不是使用alert/prompt
        const createDialog = () => {
            const existingDialog = document.getElementById('png-export-settings-dialog');
            if (existingDialog) {
                document.body.removeChild(existingDialog);
            }
            
            // 创建对话框
            const dialog = document.createElement('div');
            dialog.id = 'png-export-settings-dialog';
            dialog.style.position = 'fixed';
            dialog.style.top = '50%';
            dialog.style.left = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.style.background = 'rgba(40, 40, 40, 0.9)';
            dialog.style.color = 'white';
            dialog.style.padding = '20px';
            dialog.style.borderRadius = '10px';
            dialog.style.zIndex = '9999';
            dialog.style.minWidth = '300px';
            dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            
            return dialog;
        };
        
        return new Promise((resolve) => {
            const dialog = createDialog();
            
            // 创建内容
            dialog.innerHTML = `
                <h3 style="margin-top:0;color:#fff;font-size:16px;">Export PNG Sequence Settings</h3>
                <div style="margin:10px 0;">
                    <label for="export-fps" style="display:block;margin-bottom:5px;">Frame Rate (1-60 fps):</label>
                    <input type="number" id="export-fps" value="${captureSettings.fps}" min="1" max="60" style="width:100%;padding:5px;box-sizing:border-box;background:#333;color:#fff;border:1px solid #555;">
                </div>
                <div style="margin:10px 0;">
                    <label for="export-duration" style="display:block;margin-bottom:5px;">Duration (1-30 seconds):</label>
                    <input type="number" id="export-duration" value="${captureSettings.duration}" min="1" max="30" style="width:100%;padding:5px;box-sizing:border-box;background:#333;color:#fff;border:1px solid #555;">
                </div>
                <div style="text-align:right;margin-top:15px;">
                    <button id="export-cancel" style="padding:5px 10px;margin-right:10px;background:#555;color:#fff;border:none;border-radius:3px;cursor:pointer;">Cancel</button>
                    <button id="export-confirm" style="padding:5px 10px;background:#4CAF50;color:#fff;border:none;border-radius:3px;cursor:pointer;">Export</button>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            // 设置事件处理器
            document.getElementById('export-confirm').addEventListener('click', () => {
                const fps = parseInt(document.getElementById('export-fps').value, 10);
                const duration = parseInt(document.getElementById('export-duration').value, 10);
                
                let isValid = true;
                if (isNaN(fps) || fps < 1 || fps > 60) {
                    alert(`Invalid frame rate. Using default value ${DEFAULT_CAPTURE_FPS}.`);
                    setCaptureSettings(prev => ({ ...prev, fps: DEFAULT_CAPTURE_FPS }));
                    isValid = false;
                }
                
                if (isNaN(duration) || duration < 1 || duration > 30) {
                    alert(`Invalid duration. Using default value ${DEFAULT_RECORDING_DURATION_S}.`);
                    setCaptureSettings(prev => ({ ...prev, duration: DEFAULT_RECORDING_DURATION_S }));
                    isValid = false;
                }
                
                if (isValid) {
                    setCaptureSettings({
                        fps: fps,
                        duration: duration
                    });
                }
                
                document.body.removeChild(dialog);
                totalFramesToCapture.current = captureSettings.fps * captureSettings.duration;
                console.log(`Updated settings: ${captureSettings.fps} fps for ${captureSettings.duration}s = ${totalFramesToCapture.current} frames`);
                resolve(true);
            });
            
            document.getElementById('export-cancel').addEventListener('click', () => {
                document.body.removeChild(dialog);
                resolve(false);
            });
        });
    }, [captureSettings]);

    const startPngCapture = useCallback(() => {
        console.log("==== 开始PNG序列捕获流程 ====");
        
        // 首先检查是否已经在导出
        if (captureInProgressRef.current) {
            console.log("已经在导出中。忽略请求。");
            return;
        }
        
        // 设置捕获标志 - 应该在最开始就设置，防止重复点击
        captureInProgressRef.current = true;
        
        // 设置重置保护 - 如果有其他地方尝试重置捕获标志，会被立即恢复
        const setupResetProtection = () => {
            // 清除现有的保护定时器
            if (captureResetProtectionTimerRef.current) {
                clearInterval(captureResetProtectionTimerRef.current);
            }
            
            // 创建新的保护定时器
            captureResetProtectionTimerRef.current = setInterval(() => {
                if (!captureInProgressRef.current) {
                    console.log("捕获标志被意外重置，通过保护机制恢复");
                    captureInProgressRef.current = true;
                }
            }, 50); // 每50ms检查一次
            
            // 5分钟后自动清除保护，避免无限循环
            setTimeout(() => {
                clearInterval(captureResetProtectionTimerRef.current);
                captureResetProtectionTimerRef.current = null;
            }, 5 * 60 * 1000);
        };
        
        // 启动保护机制
        setupResetProtection();
        
        // 注意：不依赖React状态更新，使用ref标记来控制流程
        setIsExporting(true);  // 这个状态仅用于UI更新
        setProgress(0);
        setStatusMessage('初始化捕获...');
        
        if (!TEST_MODE) {
            // 查找目标元素
            targetElementRef.current = findTargetElement();
            if (!targetElementRef.current) {
                alert("无法开始导出: 未找到目标元素或元素尺寸为零。请先点击动画使其处于活动状态。");
                setStatusMessage('未找到目标');
                clearInterval(captureResetProtectionTimerRef.current);
                captureInProgressRef.current = false;
                setIsExporting(false);
                return;
            }
        } else {
            console.log("测试模式：跳过寻找目标元素");
        }
        
        // 询问设置并确认
        (async () => {
            try {
                const shouldContinue = TEST_MODE ? true : await promptForSettings();
                if (!shouldContinue) {
                    console.log("用户取消设置。");
                    clearInterval(captureResetProtectionTimerRef.current);
                    captureInProgressRef.current = false;
                    setIsExporting(false);
                    return; // 用户取消
                }
                
                // 确认设置后继续
                const captureInfo = TEST_MODE ? 
                    '测试模式' : 
                    `${totalFramesToCapture.current} 帧，持续 ${captureSettings.duration}秒，帧率 ${captureSettings.fps}fps`;
                
                // 检查帧数是否超过限制
                if (totalFramesToCapture.current > MAX_FRAMES) {
                    console.log(`警告：帧数(${totalFramesToCapture.current})超过限制(${MAX_FRAMES})，将被限制`);
                    totalFramesToCapture.current = MAX_FRAMES;
                }
                
                console.log(`开始PNG序列捕获: ${captureInfo}`);
                if (!TEST_MODE) {
                    console.log(`目标元素: id=${targetElementRef.current.id}, width=${targetElementRef.current.offsetWidth}, height=${targetElementRef.current.offsetHeight}`);
                }
                
                // 清除旧数据
                capturedFramesRef.current = [];
                frameCounterRef.current = 0;
                lastCaptureTimeRef.current = 0;
                
                // 记录开始时间
                startTimeRef.current = performance.now();
                
                // 再次检查捕获标志
                if (!captureInProgressRef.current) {
                    console.error("捕获标志已重置，重新设置为true");
                    captureInProgressRef.current = true;
                }
                
                try {
                    // 直接启动捕获，不使用setTimeout
                    console.log("直接启动捕获流程...", isExporting, captureInProgressRef.current);
                    await captureFramesSequentially();
                } catch (error) {
                    console.error("启动捕获时出错:", error);
                    alert(`启动错误: ${error.message}`);
                    clearInterval(captureResetProtectionTimerRef.current);
                    captureInProgressRef.current = false;
                    setIsExporting(false);
                    setStatusMessage('启动失败');
                }
            } catch (error) {
                console.error("设置过程出错:", error);
                clearInterval(captureResetProtectionTimerRef.current);
                captureInProgressRef.current = false;
                setIsExporting(false);
                setStatusMessage('设置出错');
            }
        })();
    }, [findTargetElement, promptForSettings, captureFramesSequentially, isExporting]);
    
    // 点击导出按钮的处理函数
    const handleExportClick = useCallback(() => {
        if (captureInProgressRef.current) {
            console.log("已经在导出中。忽略点击。");
            return;
        }
        console.log("Export button clicked. Starting capture...");
        startPngCapture();
    }, [startPngCapture]);

    // --- Effects ---

    useEffect(() => {
        // Update totalFramesToCapture when settings change
        totalFramesToCapture.current = captureSettings.duration * captureSettings.fps;
    }, [captureSettings]);

    useEffect(() => {
        const initialTimeoutId = setTimeout(addExportButton, 1500);
        const observer = new MutationObserver(() => {
            if (exportButtonRef.current && !document.body.contains(exportButtonRef.current)) {
                console.log('Export button (PNG) detached, attempting re-add.');
                exportButtonAddedRef.current = false;
                exportButtonRef.current = null;
                addExportButton();
            } else if (!exportButtonAddedRef.current) {
                addExportButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            clearTimeout(initialTimeoutId);
            observer.disconnect();
            
            // 组件卸载时保险地清理
            captureInProgressRef.current = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            
            if (exportButtonRef.current) {
                exportButtonRef.current.removeEventListener('click', handleExportClick);
                if (exportButtonRef.current.parentNode) {
                    exportButtonRef.current.parentNode.removeChild(exportButtonRef.current);
                }
            }
            exportButtonAddedRef.current = false;
            exportButtonRef.current = null;
        };
    }, [addExportButton, handleExportClick]);

    useEffect(() => {
        updateButtonState();
    }, [isExporting, progress, statusMessage, updateButtonState]);

    return null;
};

export default VideoExportDecoratorPngSequence;

// --- END OF REFACTORED FILE VideoExportDecorator_PngSequence.jsx ---