import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import firebase from './config/firebase';
import { GeoFirestore } from 'geofirestore';

// Introducir varios puntos
const lat = 37.462936;
const lng = -5.964594;

// Center
const centerLat = 37.394198; 
const centerLng = -6.000574;

const radius = 200;

export default class App extends React.Component {

	state = {
		users: []
	}

	async createDocument() {
		const doc = {
			name: 'name',
			age: 'age',
			coordinates: new firebase.firestore.GeoPoint(lat, lng),
			
		};
		const geofirestore = new GeoFirestore(firebase.firestore());
		const geocollection = geofirestore.collection('users');

		await geocollection.add(doc).then( async (docRef) => {
			console.log(docRef);

		});

	}

	readDocument() {

		const firestore = firebase.firestore();
		const geofirestore = new GeoFirestore(firestore);
        const geocollection = geofirestore.collection('users');

		geocollection.limit(50).near({
			center: new firebase.firestore.GeoPoint(centerLat, centerLng),
			radius: radius
		}).get().then((querySnapshot) => {
			
			let users = [];
	
			for (let i = 0; i < querySnapshot.docs.length; i++) {
				let {doc} = querySnapshot.docChanges()[i];
				//console.log(doc.distance)
				let user = {...querySnapshot.docs[i].data(), distance: doc.distance, id: querySnapshot.docs[i].id}
				users.push(user)
				//Alert.alert(JSON.stringify(users))
			}
			console.log(users)
			
			this.setState({users: users})
			
			
		});
	}

	// If there is any change in any document in the user collection, it breaks
	async readListenDocument() {

		const firestore = firebase.firestore();
		const geofirestore = new GeoFirestore(firestore);
        const geocollection = geofirestore.collection('users');

		let query = await geocollection.limit(50).near({
			center: new firebase.firestore.GeoPoint(centerLat, centerLng),
			radius: radius
		});

		let docQuery = await query.onSnapshot((snapshot) => {
			//console.log('snapshot', snapshot)
			let users = [];
	
			for (let i = 0; i < snapshot.docs.length; i++) {
				let {doc} = snapshot.docChanges()[i];
				//console.log(doc.distance)
				let user = {...snapshot.docs[i].data(), distance: doc.distance, id: snapshot.docs[i].id}
				users.push(user)
				//Alert.alert(JSON.stringify(users))
			}
			console.log(users)
			
			this.setState({users: users})
			//console.log('doc changes', snapshot.docChanges())
		});
	}




	componentDidMount() {
		//console.log(firebase)
	}

	render() {
		//console.log('state', this.state.users);

		return (
			<ScrollView>

				<View style={styles.container}>
					<TouchableOpacity onPress={() => this.createDocument()}>
						<Text>
							Add
						</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => this.readListenDocument()}>
						<Text>
							query
						</Text>
					</TouchableOpacity>
					{this.state ? this.state.users.map(user => {
						return (
							<View key={user.id}>
								<Text>id: {user.id}</Text>
								<Text>distance: {user.distance}</Text>
							</View>
						)
					})
					:
					null}
				
				</View>

			</ScrollView>
			
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 20
	},
});
