import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Minus, Plus, Scan, X } from "phosphor-react-native";
import { faker } from "@faker-js/faker";
import { itemType } from "@/app/types";
import { CustomTextInput } from "../ui";
import { CameraView, Camera, CameraType } from "expo-camera";

interface DialogItensInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  produtos: itemType[];
  setProdutos: React.Dispatch<React.SetStateAction<itemType[]>>;
  item: itemType;
  setItem: React.Dispatch<React.SetStateAction<itemType>>;
}

const DialogAddItens = ({
  open,
  setOpen,
  setProdutos,
  item,
  setItem,
}: DialogItensInterface) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    onNewScanResult(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const toggleScanning = () => {
    setIsActive(!isActive);
  };

  const handleChangeInput = (name: string, value: string) => {
    if (item) {
      const updatedItem = {
        ...item,
        [name]: name === "qtd" ? Number(value) : value,
      };
      setItem(updatedItem);
    }
  };

  const handleSubmit = () => {
    if (item && item.cod && item.qtd) {
      setProdutos((prevState) => [
        ...prevState,
        { ...item, id: faker.string.uuid() },
      ]);
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setIsActive(false);
    setItem({ id: faker.string.uuid(), qtd: 1 });
  };

  const onNewScanResult = (decodedText: string) => {
    setItem({
      ...item,
      cod: decodedText,
    });
    setIsActive(false);
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setOpen(false)}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            width: "80%",
            padding: 20,
            backgroundColor: "white",
            borderRadius: 20,
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
            Adicionar Item
          </Text>
          <Text style={{ marginBottom: 15 }}>Insira o código ou escaneie</Text>

          {!isActive ? (
            <>
              <View>
                <Text>Código</Text>
                <View
                  style={{
                    gap: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 15,
                  }}
                >
                  <CustomTextInput
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      padding: 8,
                      marginTop: 5,
                    }}
                    value={item?.cod}
                    onChangeText={(text) => handleChangeInput("cod", text)}
                  />

                  <TouchableOpacity
                    onPress={toggleScanning}
                    style={{
                      padding: 5,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 10,
                    }}
                  >
                    <Scan size={30} weight="fill" color="black" />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text>Quantidade</Text>
                <View
                  style={{
                    gap: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setItem({ ...item, qtd: item.qtd - 1 })}
                    style={{
                      padding: 5,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 10,
                    }}
                  >
                    <Minus size={30} weight="bold" color="black" />
                  </TouchableOpacity>
                  <CustomTextInput
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      padding: 8,
                      marginTop: 5,
                    }}
                    value={String(item.qtd)}
                    onChangeText={(text) => handleChangeInput("qtd", text)}
                  />
                  <TouchableOpacity
                    onPress={() => setItem({ ...item, qtd: item.qtd + 1 })}
                    style={{
                      padding: 5,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 10,
                    }}
                  >
                    <Plus size={30} weight="bold" color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  marginTop: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                  }}
                >
                  Adicionar
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CameraView
                style={{ flex: 1 }}
                ratio="4:3"
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: ["ean13", "ean8", "codabar"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: "transparent",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignSelf: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Text>Flip Camera</Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
              {/* <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                pictureSize={"50"}
                style={StyleSheet.absoluteFillObject}
              /> */}
              {scanned && (
                <Button
                  title={"Tap to Scan Again"}
                  onPress={() => setScanned(false)}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default DialogAddItens;
