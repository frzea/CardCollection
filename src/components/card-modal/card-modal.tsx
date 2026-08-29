import { resolveImageUrl } from "@/api/client";
import { useTheme } from "@/hooks/useTheme";
import { Cards } from "@/types/type";
import { Image } from "expo-image";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { createStyles } from "./styles";

type CardModalProps = {
  visible: boolean;
  card: Cards | null;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
  onClose: () => void;
};

export function CardModal({ visible, card, count, onAdd, onClose, onRemove }: CardModalProps) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={style.modalBgContainer}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={style.modal}>
              <View style={style.image}>
                <Image
                  source={{ uri: resolveImageUrl(card?.image || "...") }}
                  style={StyleSheet.absoluteFill}
                  contentFit="contain"
                />
                {count > 1 && (
                  <View style={style.badge}>
                    <Text style={style.badgeText}>x{count}</Text>
                  </View>
                )}
              </View>
              <Text style={style.number}>#{card?.number}</Text>
              <View style={style.controls}>
                <TouchableOpacity
                  style={[style.controlButton, count === 0 && style.controlButtonDisabled]}
                  onPress={onRemove}
                  disabled={count === 0}
                >
                  <Text style={style.controlButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={style.countText}>{count}</Text>
                <TouchableOpacity style={style.controlButton} onPress={onAdd}>
                  <Text style={style.controlButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
