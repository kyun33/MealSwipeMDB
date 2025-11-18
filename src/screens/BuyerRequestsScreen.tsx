import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const BuyerRequestsScreen = () => {
  const buyerRequests = [
    // Sample data for buyer requests
    { id: '1', request: 'Looking for a pizza offer' },
    { id: '2', request: 'Need a sushi deal' },
    { id: '3', request: 'Seeking a burger discount' },
  ];

  const renderRequest = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>{item.request}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buyer Requests</Text>
      <FlatList
        data={buyerRequests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  requestItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  requestText: {
    fontSize: 16,
  },
});

export default BuyerRequestsScreen;