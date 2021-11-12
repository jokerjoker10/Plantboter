import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, useIonViewDidEnter, IonSelect, IonSkeletonText, useIonViewWillEnter, useIonModal, useIonViewWillLeave } from '@ionic/react';
import { checkmarkOutline, closeOutline, ellipsisHorizontalOutline, hardwareChipOutline, returnDownForwardOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import { useEffect, useState } from 'react';
import Loading from '../../loading';
import { ControllerListModel } from '../../../model/controllerlist.model';
import { PlantListModel } from '../../../model/plantlist.model';
import { AxiosError } from 'axios';
import { Component } from 'ionicons/dist/types/stencil-public-runtime';

interface ControllerCardProps {
    controller: ControllerListModel
}

const ControllerCard: React.FC<ControllerCardProps> = ({ controller }) => {
    const [more_plants, setMorePlants] = useState(false);
    const [plant_list, setPlantList] = useState<Array<PlantListModel>>();
    function getPlantList() {
        api.plants.getPlantsOfController(controller.id)
            .then((data) => {
                setPlantList(data.data.plants);

                if (data.data.plants?.length > 3) {
                    setMorePlants(true);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (!plant_list) {
        getPlantList();
    }




    return (
        <IonCard class="controller-card" href={"/settings/" + controller.id}>
            <IonCardHeader>
                <IonCardTitle><IonIcon icon={hardwareChipOutline} color="medium"></IonIcon>{controller.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {plant_list?.slice(0, 3).map((plant: PlantListModel) => (
                    <IonItem lines="none" key={Number(plant.id)}>
                        <IonIcon icon={returnDownForwardOutline}></IonIcon><p>{plant.name}</p>
                    </IonItem>
                ))}
                {more_plants ? (
                    <>
                        <IonItem lines="none">
                            <IonIcon icon={returnDownForwardOutline}></IonIcon>
                            <IonIcon icon={ellipsisHorizontalOutline}></IonIcon>
                        </IonItem>
                    </>
                ) : (
                    <></>
                )}
            </IonCardContent>
        </IonCard>
    );
};

export default ControllerCard;
