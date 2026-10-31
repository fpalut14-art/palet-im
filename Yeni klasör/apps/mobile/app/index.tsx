import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const categories = ["Ahşap palet", "Euro & EPAL", "Geri dönüşüm", "Nakliye"];
export default function HomeScreen() {
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
    <Text style={styles.kicker}>TÜRKİYE'NİN PALET TİCARET AĞI</Text>
    <Text style={styles.title}>Palet ticaretinin dijital merkezi.</Text>
    <Text style={styles.copy}>İhtiyacınız olan paleti bulun, tedarikçilerden teklif alın.</Text>
    <TextInput style={styles.input} placeholder="Palet türü veya ölçü ara" placeholderTextColor="#718096" />
    <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>İlanlarda ara →</Text></TouchableOpacity>
    <Text style={styles.heading}>Kategoriler</Text>
    {categories.map((item) => <View key={item} style={styles.category}><Text style={styles.categoryText}>{item}</Text><Text style={styles.chevron}>›</Text></View>)}
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: "#101e32" }, content: { padding: 24, paddingTop: 44 }, kicker: { color: "#ffb36f", fontSize: 11, fontWeight: "700", letterSpacing: 1.4 }, title: { color: "white", fontSize: 38, lineHeight: 44, fontWeight: "800", marginTop: 16 }, copy: { color: "#cad4df", lineHeight: 24, fontSize: 15, marginTop: 12, marginBottom: 26 }, input: { backgroundColor: "white", padding: 16, borderRadius: 10, fontSize: 15 }, button: { backgroundColor: "#f47b20", padding: 16, alignItems: "center", borderRadius: 10, marginTop: 10 }, buttonText: { color: "white", fontWeight: "700" }, heading: { color: "white", fontSize: 22, fontWeight: "700", marginTop: 38, marginBottom: 14 }, category: { backgroundColor: "#1d2d43", padding: 17, borderRadius: 10, marginBottom: 10, flexDirection: "row", justifyContent: "space-between" }, categoryText: { color: "white", fontWeight: "600" }, chevron: { color: "#ff9b4a", fontSize: 20 } });
