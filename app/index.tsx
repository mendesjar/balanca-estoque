import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Download, Plus, Trash, Upload, X } from "phosphor-react-native";
import { itemType } from "./types";
import { faker } from "@faker-js/faker";
import { formatDate } from "date-fns";
import {
  DialogAddItens,
  DialogClearProducts,
  DialogImportProducts,
} from "./components/dialogs";
import {
  documentDirectory,
  writeAsStringAsync,
  getInfoAsync,
  makeDirectoryAsync,
  EncodingType,
} from "expo-file-system";
import * as Sharing from "expo-sharing";
import { CustomTextInput } from "./components/ui";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";

const App = () => {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const { height } = Dimensions.get("window");
  const [produtos, setProdutos] = useState<itemType[]>([]);
  const [item, setItem] = useState<itemType>({
    id: faker.string.uuid(),
    cod: "",
    qtd: 1,
  });
  const [openDialogAddItens, setOpenDialogAddItens] = useState(false);
  const [openDialogClearProducts, setOpenDialogClearProducts] = useState(false);
  const [openDialogImportProducts, setOpenDialogImportProducts] =
    useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#fafafa",
      },
      headerTintColor: "#fafafa",
    });
  }, [navigation]);

  const buttonActions = [
    {
      id: "createFileButton",
      label: "SALVAR",
      colorHover: "#22c55e",
      icon: <Download weight="fill" color="white" />,
      onClick: () => handleOpenDialogSaveProducts(),
    },
    {
      id: "importFileButton",
      label: "IMPORTAR",
      colorHover: "#64748b",
      icon: <Upload weight="fill" color="white" />,
      onClick: () => setOpenDialogImportProducts(true),
    },
    {
      id: "clearProdutosListButton",
      label: "LIMPAR",
      colorHover: "#ef4444",
      icon: <Trash weight="fill" color="white" />,
      onClick: () => handleOpenDialogClearProducts(),
    },
    {
      id: "addItensButton",
      label: "ADICIONAR",
      colorHover: "#3b82f6",
      icon: <Plus weight="bold" color="white" />,
      onClick: () => handleOpenDialogAddItens(),
    },
  ];

  function handleOpenDialogAddItens() {
    setOpenDialogAddItens(true);
  }

  function handleOpenDialogClearProducts() {
    if (produtos?.length) {
      setOpenDialogClearProducts(true);
    }
  }

  function handleOpenDialogSaveProducts() {
    if (produtos?.length) {
      handleDownloadFile("", produtos);
    }
  }

  function handleChangeEdit(name: string, value: string, produtoIndex: number) {
    setProdutos((prevState) => [
      ...prevState.map((obj, index) => {
        if (index === produtoIndex) {
          return {
            ...obj,
            [name]: name === "qtd" ? Number(value) : value,
          };
        }
        return obj;
      }),
    ]);
  }

  function handleDeleteItem(produtoId: string) {
    setProdutos((prevState) =>
      prevState.filter((item) => item.id !== produtoId)
    );
  }

  function formatData(items: itemType[]) {
    return items.map((item) => `${item.cod},${item.qtd}`).join("\n");
  }

  const handleDownloadFile = async (name = "", produtos: itemType[]) => {
    const arquivoDescricao =
      name && name !== ""
        ? `INVENT-${formatDate(new Date(), "dd/MM/yyyy")}-${name}.txt`
        : `INVENT-${formatDate(new Date(), "dd/MM/yyyy")}.txt`;

    if (produtos?.length) {
      const fileContent = formatData(produtos);
      const uri = documentDirectory + arquivoDescricao;

      try {
        const folderUri = documentDirectory;
        if (!folderUri) return;
        const folderInfo = await getInfoAsync(folderUri);

        if (!folderInfo.exists) {
          await makeDirectoryAsync(folderUri, {
            intermediates: true,
          });
        }

        console.log(folderInfo, folderUri);

        await writeAsStringAsync(uri, fileContent, {
          encoding: EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }

        console.log("Arquivo salvo com sucesso:", uri);
      } catch (error) {
        console.error("Erro ao salvar o arquivo:", error);
      }
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fafafa" }}>
      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
          justifyContent: "center",
        }}
      >
        <Image
          style={{ width: "50%", height: height * 0.05 }}
          source={require("@/assets/images/logo-balanca.svg")}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>

      <ScrollView style={{ flex: 1 }}>
        {produtos.length ? (
          <View>
            {produtos.map((item, index) => {
              return (
                <View
                  key={item.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text>{index + 1}</Text>
                  <CustomTextInput
                    value={item.cod}
                    onChangeText={(text) =>
                      handleChangeEdit("cod", text, index)
                    }
                    style={{ borderWidth: 1, flex: 1, margin: 5 }}
                  />
                  <CustomTextInput
                    value={String(item.qtd)}
                    onChangeText={(text) =>
                      handleChangeEdit("qtd", text, index)
                    }
                    keyboardType="numeric"
                    style={{ borderWidth: 1, flex: 1, margin: 5 }}
                  />
                  <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                    <X />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              Sem Produtos
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {buttonActions.map((button) => (
          <TouchableOpacity
            key={button.id}
            onPress={button.onClick}
            style={{
              marginHorizontal: 10,
              backgroundColor: button.colorHover,
              padding: 20,
              borderRadius: 50,
            }}
          >
            {button.icon}
          </TouchableOpacity>
        ))}
      </View>

      <DialogAddItens
        open={openDialogAddItens}
        setOpen={setOpenDialogAddItens}
        produtos={produtos}
        setProdutos={setProdutos}
        item={item}
        setItem={setItem}
      />

      <DialogClearProducts
        open={openDialogClearProducts}
        setOpen={setOpenDialogClearProducts}
        setProdutos={setProdutos}
      />

      <DialogImportProducts
        openDialog={openDialogImportProducts}
        setOpenDialog={setOpenDialogImportProducts}
        setProdutos={setProdutos}
      />

      {/* <DialogAddName
        open={openDialogName}
        setOpen={setOpenDialogName}
        name={name}
        setName={setName}
        createTextFile={() => {}}
      /> */}
    </View>
  );
};

export default App;
