/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Animated, Text as DefaultText, View as DefaultView, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { forwardRef } from 'react';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const ButtonThemed = forwardRef(function ButtonThemed(props:any,ref) {
  const { title, onPress,disabled,width } = props;
  const animated = new Animated.Value(1);
  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.4,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Pressable onPressIn={fadeIn} onPressOut={fadeOut} onPress={onPress} disabled={disabled} style={{width:width}}>
        <Animated.View
          style={{ 
            backgroundColor: !disabled ? '#28bc64' : '#7ecc9e', 
            opacity: animated,
            padding: 10,
            justifyContent: 'center',
            flexDirection: 'row',
            borderRadius: 6
          }}>
        <Text style={{
            color: 'white',
            fontSize: 15
          }}>
            {title}
        </Text>
        </Animated.View>
    </Pressable>
  )
});
