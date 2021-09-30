import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, useIonViewDidEnter, IonSelect, IonSkeletonText } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import { useState } from 'react';
import Loading from '../../loading';

interface ContainerProps { }

const DeleteUser: React.FC<ContainerProps> = () => {
    return (
        <IonCard class="user-card">
            <IonCardHeader>
                <IonCardTitle>Delete User</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                <p>
                    TODO
                </p>
            </IonCardContent>
        </IonCard>
    );
};

export default DeleteUser;
