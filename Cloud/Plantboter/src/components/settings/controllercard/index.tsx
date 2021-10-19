import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, useIonViewDidEnter, IonSelect, IonSkeletonText } from '@ionic/react';
import { checkmarkOutline, closeOutline, hardwareChipOutline, returnDownForwardOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import { useState } from 'react';
import Loading from '../../loading';
import { ControllerModel } from '../../../model/controller.model';

interface ControllerCardProps {
    controller: ControllerModel
}

const ControllerCard: React.FC<ControllerCardProps> = ({controller}) => {
    return (
        <IonCard class="controller-card" href={"/settings/" + controller.id}>
            <IonCardHeader>
                <IonCardTitle><IonIcon icon={hardwareChipOutline} color="medium"></IonIcon>{controller.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonItem lines="none">
                    <IonIcon icon={returnDownForwardOutline}></IonIcon><p>Plant : TODO</p>
                </IonItem>
            </IonCardContent>
        </IonCard>
    );
};

export default ControllerCard;
