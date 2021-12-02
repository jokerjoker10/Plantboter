import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, useIonViewDidEnter } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import { useState } from 'react';
import api from '../../../services/Api';
import './style.css';

const PlantList: React.FC = () => {
    const [plant_list, setPlantList] = useState<Array<any>>();
    useIonViewDidEnter(() => {
        api.statistic.getPlantDashboard()
        .then((response) => {
            setPlantList(response.data.plant_list)
        })
        .catch((error) => {
            console.log(error)
        })
    })

  return (
    <IonCard>
        <IonCardHeader>
            <IonCardTitle>Plant Log</IonCardTitle>
        </IonCardHeader>
        <div className="grid">
            {plant_list?.map((plant) => (
                <IonCard button href={'/log/' + plant.id} color="medium">
                    <IonCardHeader>
                        <IonCardTitle>{plant.name}</IonCardTitle>
                    </IonCardHeader>
                </IonCard>
            ))}
        </div>
    </IonCard>
  );
};

export default PlantList;
