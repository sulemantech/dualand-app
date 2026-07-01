import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PURPLE = '#7E57C2';
const PURPLE_DARK = '#4527A0';
const PURPLE_LIGHT = '#EDE7F6';

export type AlertButtonStyle = 'default' | 'cancel' | 'destructive';

export interface AlertButton {
  text: string;
  style?: AlertButtonStyle;
  onPress?: () => void;
  disabled?: boolean;
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  icon?: string;
  buttons: AlertButton[];
  onDismiss: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  icon,
  buttons,
  onDismiss,
}) => {
  const scale   = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, tension: 260, friction: 22, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.88);
      opacity.setValue(0);
    }
  }, [visible]);

  const useHorizontalButtons = buttons.length === 2;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onDismiss}
      animationType="none"
      statusBarTranslucent
    >
      {/* backdrop — tap to dismiss */}
      <Pressable style={styles.backdrop} onPress={onDismiss}>

        {/* dialog — swallows touches so they don't hit backdrop */}
        <Pressable onPress={() => {}}>
          <Animated.View style={[styles.dialog, { opacity, transform: [{ scale }] }]}>

            {/* purple top accent */}
            <View style={styles.topAccent} />

            {/* icon */}
            {icon ? (
              <View style={styles.iconWrap}>
                <Text style={styles.iconText}>{icon}</Text>
              </View>
            ) : null}

            {/* title */}
            <Text style={styles.title}>{title}</Text>

            {/* message */}
            {message ? <Text style={styles.message}>{message}</Text> : null}

            {/* buttons */}
            <View
              style={[
                styles.buttonsWrap,
                useHorizontalButtons ? styles.buttonsRow : styles.buttonsCol,
              ]}
            >
              {buttons.map((btn, i) => {
                const isCancel      = btn.style === 'cancel';
                const isDestructive = btn.style === 'destructive';
                const isDefault     = !isCancel && !isDestructive;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.btn,
                      useHorizontalButtons ? styles.btnFlex : styles.btnFull,
                      i > 0 && useHorizontalButtons  && styles.btnGapH,
                      i > 0 && !useHorizontalButtons && styles.btnGapV,
                      isCancel      && styles.btnCancel,
                      isDestructive && styles.btnDestructive,
                      isDefault     && styles.btnDefault,
                      btn.disabled  && styles.btnDisabled,
                    ]}
                    onPress={() => {
                      onDismiss();
                      btn.onPress?.();
                    }}
                    disabled={btn.disabled}
                    activeOpacity={0.78}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        isCancel      && styles.btnTextCancel,
                        isDestructive && styles.btnTextDestructive,
                        isDefault     && styles.btnTextDefault,
                      ]}
                    >
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(30, 20, 60, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  dialog: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: PURPLE_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  topAccent: {
    height: 4,
    backgroundColor: PURPLE,
  },

  iconWrap: {
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 4,
  },
  iconText: {
    fontSize: 36,
  },

  title: {
    fontSize: 17,
    fontFamily: 'PoppinsBold',
    color: '#1A1A2E',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 14,
    color: '#5A6273',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 20,
    marginBottom: 4,
  },

  buttonsWrap: {
    padding: 16,
    paddingTop: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  buttonsCol: {
    flexDirection: 'column',
  },

  btn: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFlex: {
    flex: 1,
  },
  btnFull: {
    width: '100%',
  },
  btnGapH: {
    marginLeft: 10,
  },
  btnGapV: {
    marginTop: 8,
  },

  btnDefault: {
    backgroundColor: PURPLE,
  },
  btnCancel: {
    backgroundColor: '#F0EDF8',
  },
  btnDestructive: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  btnDisabled: {
    opacity: 0.4,
  },

  btnText: {
    fontSize: 15,
    fontFamily: 'PoppinsBold',
  },
  btnTextDefault: {
    color: '#FFFFFF',
  },
  btnTextCancel: {
    color: PURPLE,
  },
  btnTextDestructive: {
    color: '#EF4444',
  },
});
