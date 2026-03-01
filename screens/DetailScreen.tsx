import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    ActivityIndicator, 
    TouchableOpacity, 
    TextInput, 
    Alert, 
    SafeAreaView, 
    Keyboard, 
    Linking 
} from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, addDoc, query, orderBy } from 'firebase/firestore';

export default function DetailScreen() {
    const [loading, setLoading] = useState(true);
    const [educations, setEducations] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('Online'); // Varsayılan eğitim tipi

    // 1. VERİLERİ ÇEKME (READ)
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "todos"));
            const list: any[] = [];
            querySnapshot.forEach((d) => {
                list.push({ id: d.id, ...d.data() });
            });
            setEducations(list);
        } catch (e) { 
            console.log("Hata:", e); 
        } finally { 
            setLoading(false); 
        }
    };

    // 2. EĞİTİM EKLEME (CREATE)
    const addEducation = async () => {
        if (name.trim().length === 0) {
            Alert.alert("Uyarı", "Lütfen eğitim adını girin!");
            return;
        }

        try {
            await addDoc(collection(db, "todos"), {
                task: name, // Eğitim Adı
                eduType: type, // Eğitim Tipi (Yüz Yüze/Hybrid/Online)
                date: new Date().toLocaleDateString('tr-TR'), // Eğitim Tarihi (Bugünün tarihi)
                createdAt: new Date()
            });
            setName('');
            Keyboard.dismiss();
            fetchData();
            Alert.alert("Başarılı", "Eğitim takvime eklendi.");
        } catch (e) {
            Alert.alert("Hata", "Eklenemedi!");
        }
    };

    // 3. WHATSAPP İLE KAYIT (Hocanın istediği özellik)
    const openWhatsApp = (eduName: string) => {
        const message = `Merhaba, ${eduName} eğitimi hakkında bilgi alabilir miyim?`;
        const url = `https://wa.me/905532832399?text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            Alert.alert("Hata", "WhatsApp açılamadı.");
        });
    };

    // 4. VERİ SİLME (DELETE)
    const deleteItem = async (id: string) => {
        try {
            await deleteDoc(doc(db, "todos", id));
            fetchData();
        } catch (e) {
            console.log("Silme hatası:", e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Eğitim Takvimi</Text>

            {/* EKLEME FORMU */}
            <View style={styles.inputCard}>
                <TextInput 
                    style={styles.input} 
                    placeholder="Eğitim Adı Giriniz..." 
                    value={name} 
                    onChangeText={setName} 
                />
                
                <Text style={styles.label}>Eğitim Tipi Seçin:</Text>
                <View style={styles.typeRow}>
                    {['Yüz Yüze', 'Hybrid', 'Online'].map((t) => (
                        <TouchableOpacity 
                            key={t} 
                            onPress={() => setType(t)} 
                            style={[styles.typeBtn, type === t && styles.activeType]}
                        >
                            <Text style={[styles.typeBtnText, type === t && styles.activeTypeText]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.addButton} onPress={addEducation}>
                    <Text style={styles.addButtonText}>TAKVİME EKLE</Text>
                </TouchableOpacity>
            </View>

            {/* LİSTELEME */}
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <FlatList
                    data={educations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardInfo}>
                                <Text style={styles.itemTitle}>{item.task}</Text>
                                <Text style={styles.itemSub}>{item.eduType} | {item.date || "Tarih Belirtilmedi"}</Text>
                            </View>
                            <View style={styles.cardActions}>
                                <TouchableOpacity 
                                    style={styles.waButton} 
                                    onPress={() => openWhatsApp(item.task)}
                                >
                                    <Text style={styles.waButtonText}>Kayıt Ol</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                                    <Text style={styles.deleteText}>Sil</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Henüz bir eğitim planlanmadı.</Text>}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f7f6' },
    header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', textAlign: 'center', marginTop: 10 },
    inputCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 20, elevation: 3 },
    input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 15 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#7f8c8d' },
    typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    typeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#eee', borderRadius: 8, marginHorizontal: 4 },
    activeType: { backgroundColor: '#007AFF' },
    typeBtnText: { fontSize: 12, color: '#333' },
    activeTypeText: { color: '#fff', fontWeight: 'bold' },
    addButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center' },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    card: { 
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        padding: 15, 
        marginBottom: 10, 
        borderRadius: 12, 
        alignItems: 'center',
        borderLeftWidth: 5,
        borderLeftColor: '#007AFF',
        elevation: 2
    },
    cardInfo: { flex: 1 },
    itemTitle: { fontSize: 17, fontWeight: 'bold', color: '#2c3e50' },
    itemSub: { fontSize: 13, color: '#7f8c8d', marginTop: 4 },
    cardActions: { alignItems: 'flex-end' },
    waButton: { backgroundColor: '#25D366', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginBottom: 8 },
    waButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    deleteText: { color: '#e74c3c', fontSize: 12, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: '#aaa', marginTop: 30 }
});