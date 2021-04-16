import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableHighlight,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [failedCount, setFailedCount] = useState(0);

  function clearState() {
    setAuthenticated(false);
    setFailedCount(0);
  }

  async function scanFingerPrint() {
    try {
      let results = await LocalAuthentication.authenticateAsync();
      if (results.success) {
        setAuthenticated(true);
        setModalVisible(false);
        setFailedCount(0);
      } else {
        setFailedCount(failedCount + 1);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View
      style={[
        styles.container,
        modalVisible
          ? { backgroundColor: "#b7b7b7" }
          : { backgroundColor: "white" },
      ]}
    >
       <Image
              style={{ width: 128, height: 128, marginBottom: 50 }}
              source={require("./assets/logo.png")}
            />
      <TouchableOpacity
        onPress={() => {
          clearState();
          if (Platform.OS === "android") {
            setModalVisible(!modalVisible);
          } else {
            scanFingerPrint();
          }
        }}
        style={styles.button_container}
      >
        <Text style={styles.button_text}>
          {authenticated ? "Reset and sign in again" : "Sign in with Touch Id"}
        </Text>
      </TouchableOpacity>

      {authenticated && (
        <Text style={styles.text}>Authentication Successful! 🎉</Text>
      )}

      <Modal
        animationType="slide"
        backdropOpacity={0.3}
        transparent={true}
        visible={modalVisible}
        onShow={scanFingerPrint}
      >
        <View style={styles.modal}>
          <View style={styles.innerContainer}>
            <Text>Sign in with fingerprint</Text>
            <Image
              style={styles.image}
              source={require("./assets/fingerprint.png")}
            />
            {failedCount > 0 && (
              <Text style={styles.error_text}>
                Failed to authenticate, press cancel and try again.
              </Text>
            )}
            <TouchableHighlight
              onPress={async () => {
                LocalAuthentication.cancelAuthenticate();
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.error_text}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  button_container: {
    borderRadius: 11.1,
    backgroundColor: "#754d89",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 60,
  },
  button_text: {
    fontSize: 22,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.12,
    textAlign: "center",
    color: "#ffffff",
  },
  modal: {
    flex: 1,
    marginTop: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50
  },
  innerContainer: {
    marginTop: "30%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { 
    width: 128, 
    height: 128 ,
    marginBottom: 10
  },
  text: {
    alignSelf: "center",
    fontSize: 22,
    paddingTop: 20,
  },
  error_text: { 
    color: "red", 
    fontSize: 16,
    marginVertical: 5 
  }
});
