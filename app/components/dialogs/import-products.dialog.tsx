import React from "react";
import { Modal, View, Text, TouchableOpacity, Alert } from "react-native";
import { itemType } from "../../types";
import { faker } from "@faker-js/faker";
import { X } from "phosphor-react-native";
// import { pick, types } from "@react-native-documents/picker";

interface DialogItensInterface {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setProdutos: React.Dispatch<React.SetStateAction<itemType[]>>;
}

const DialogImportProducts = ({
  openDialog,
  setOpenDialog,
  setProdutos,
}: DialogItensInterface) => {
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const parseData = (content: string): itemType[] => {
    const lines = content.split("\n");
    const products: itemType[] = [];
    lines.map((line) => {
      const [cod, qtd] = line.split(",");
      products.push({
        id: faker.string.uuid(),
        cod,
        qtd: parseInt(qtd),
      });
    });
    return products;
  };

  const handleFileRead = async (content: string) => {
    const formatData = parseData(content);
    setProdutos((prevState) => [...prevState, ...formatData]);
    handleCloseDialog();
  };

  const readFile = async (uri: string): Promise<string> => {
    const fs = require("react-native-fs");
    const content = await fs.readFile(uri, "utf8");
    return content;
  };

  return (
    <Modal visible={openDialog} animationType="slide" transparent={true}>
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
          <TouchableOpacity
            onPress={handleCloseDialog}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: 5,
              backgroundColor: "#f0f0f0",
              borderRadius: 10,
            }}
          >
            <X size={20} color="black" />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Importar Arquivo
          </Text>
          <Text style={{ marginBottom: 20 }}>
            Selecione ou arraste o arquivo para importar
          </Text>

          <View style={{ width: "100%", alignItems: "center" }}>
            <TouchableOpacity
              // onPress={handleFileChange}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "#007bff",
                borderRadius: 5,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "white" }}>Selecionar Arquivo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DialogImportProducts;
