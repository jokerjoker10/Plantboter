import { IonButtons, IonBackButton, IonContent, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, useIonViewDidEnter } from '@ionic/react';
import './style.css';
import { RouteComponentProps } from 'react-router';
import api from '../../services/Api';
import React, { useEffect } from 'react';
import UserHeader from '../../components/user/userheader';
import ChangeEmail from '../../components/user/changeemail';
import ChangePassword from '../../components/user/changepassword';

const User: React.FC = () => {
    return (
        <IonPage>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/">Back</IonBackButton>
                </IonButtons>
                <IonTitle>User</IonTitle>
            </IonToolbar>
            <IonContent fullscreen className="background">
                <div className="user_settings">
                    <UserHeader></UserHeader>
                    <ChangeEmail></ChangeEmail>
                    <ChangePassword></ChangePassword>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default User;
