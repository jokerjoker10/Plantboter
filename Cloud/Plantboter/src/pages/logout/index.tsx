import { IonButtons, IonCard, IonContent, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, useIonViewDidEnter, useIonLoading } from '@ionic/react';
import './style.css';
import api from '../../services/Api';
import React, { useState } from 'react';



const Logout: React.FC = () => {
    const [show, dismiss] = useIonLoading();
    const [error, set_error] = useState('');

    useIonViewDidEnter(() => {
        show();
        api.logout()
        .then((response) => {
            localStorage.clear();
            window.location.href = "/auth/login";
        })
        .catch((error) => {
            set_error(error.response.data.error || error.response.data.message || 'Unknown error');
            dismiss();
        });
    }, [])

    return (
        <IonPage>
            <IonContent fullscreen className="background">
                <IonCard color="warning" style={{display: error != '' ? "block" : "none"}}>
                    <IonCardContent>
                        <p>
                            {error}
                        </p>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Logout;
