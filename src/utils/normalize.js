import { Dimensions, Platform, PixelRatio } from 'react-native';

export var { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  'window',
);

// based on iPhone 8's scale
const wscale = SCREEN_WIDTH / 375;
const hscale = SCREEN_HEIGHT / 667;

export default function normalize(size, based = 'width') {
  const newSize = based === 'height' ? size * hscale : size * wscale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

const percentageCalculation = (max, val) => max * (val / 100);

const fontCalculation = (height, width, val) => {
  const widthDimension = height > width ? width : height;
  const aspectRatioBasedHeight = (16 / 9) * widthDimension;
  return percentageCalculation(
    Math.sqrt(
      Math.pow(aspectRatioBasedHeight, 2) + Math.pow(widthDimension, 2)
    ),
    val
  );
};

export const responsiveHeight = (h) => {
  const { height } = Dimensions.get("window");
  return percentageCalculation(height, h);
};

export const responsiveWidth = (w) => {
  const { width } = Dimensions.get("window");
  return percentageCalculation(width, w);
};

export const responsiveFontSize = (f) => {
  const { height, width } = Dimensions.get("window");
  return fontCalculation(height, width, f);
};

export const responsiveScreenHeight = (h) => {
  const { height } = Dimensions.get("screen");
  return percentageCalculation(height, h);
};

export const responsiveScreenWidth = (w) => {
  const { width } = Dimensions.get("screen");
  return percentageCalculation(width, w);
};

export const responsiveScreenFontSize = (f) => {
  const { height, width } = Dimensions.get("screen");
  return fontCalculation(height, width, f);
};

const [shortDimension, longDimension] = SCREEN_WIDTH < SCREEN_HEIGHT ? [SCREEN_WIDTH, SCREEN_HEIGHT] : [SCREEN_HEIGHT, SCREEN_WIDTH];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = size => shortDimension / guidelineBaseWidth * size;
export const verticalScale = size => longDimension / guidelineBaseHeight * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
export const moderateVerticalScale = (size, factor = 0.5) => size + (verticalScale(size) - size) * factor;

export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;