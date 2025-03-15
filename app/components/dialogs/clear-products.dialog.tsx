import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { itemType } from "../../types";
// import { ProdutosService } from '@/services';

interface DialogClearProductsInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProdutos: React.Dispatch<React.SetStateAction<itemType[]>>;
}

const DialogClearProducts = ({
  open,
  setOpen,
  setProdutos,
}: DialogClearProductsInterface) => {
  const handleClearProducts = () => {
    setOpen(false);
    setProdutos([]);
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setOpen(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            padding: 20,
            backgroundColor: "white",
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Apagar Lista
          </Text>
          <Text style={{ marginBottom: 20 }}>
            Confimar deleção de toda a lista de produtos.
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "#ccc",
                borderRadius: 5,
              }}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClearProducts}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "red",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DialogClearProducts;
