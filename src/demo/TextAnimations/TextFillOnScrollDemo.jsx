import FillTextOnScroll from "../../content/TextAnimations/TextFillOnScroll/TextFillOnScroll";

const FillTextOnScrollDemo = () => {
  return (
    <div className="min-h-screen">
      <ScrollTextReveal
        text="SCROLL TO REVEAL"
        fillColor="#ffffffeb"
        borderColor="#ffffffeb"
        backgroundColor="#060606"
        textSize="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
        fontFamily="Arial, sans-serif"
        showProgress={true}
      />
    </div>
  );
};

export default FillTextOnScrollDemo;
