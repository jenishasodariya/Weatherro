import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {moderateScale} from './Constant';

export default function CTextInput(props) {
  let {
    onChangeText,
    value,
    keyboardType,
    placeholder,
    extrastyle,
    placeholderTextColor,
    maxLength,
    autoCapitalize,
  } = props;
  return (
    <View>
      <TextInput
        style={[styles.inputsty || extrastyle]}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputsty: {
    borderColor: '#CDD1D0',
    borderWidth: moderateScale(1),
    width: moderateScale(300),
    alignSelf: 'center',
    fontSize: moderateScale(16),
    padding: moderateScale(10),
    color: '#000',
    borderRadius: moderateScale(5),
    marginVertical: moderateScale(10),
  },
});
