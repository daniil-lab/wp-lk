const InjectStyle = (style: string) => {
  const styleElement: HTMLStyleElement = document.createElement("style");
  let styleSheet = null;

  document.head.appendChild(styleElement);

  styleSheet = styleElement.sheet as CSSStyleSheet;

  styleSheet.insertRule(style, styleSheet.cssRules.length);
};

export default InjectStyle;
