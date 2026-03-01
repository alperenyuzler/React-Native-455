import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Kullanıcı adı: alperen | Şifre: 1234
        if (username.toLowerCase() === 'alperen' && password === '1234') {
            navigation.navigate('Detail', { userName: 'Alperen' });
        } else {
            Alert.alert('Hata', 'Kullanıcı adı veya şifre hatalı!');
        }
    };

    return (
        <View style={styles.container}>
            {/* BAŞLIK ÖDEVE UYGUN HALE GETİRİLDİ */}
            <Text style={styles.title}>Eğitim Takvim Sistemi</Text>
            <Text style={styles.subTitle}>Yüzler App Yönetim Paneli</Text>
            
            <TextInput 
                style={styles.input}
                placeholder="Kullanıcı Adı"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput 
                style={styles.input}
                placeholder="Şifre"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#fdfdfd' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50', marginBottom: 5 },
    subTitle: { fontSize: 16, textAlign: 'center', color: '#7f8c8d', marginBottom: 40 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});