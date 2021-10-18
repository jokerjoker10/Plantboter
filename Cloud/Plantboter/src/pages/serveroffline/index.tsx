import { IonButtons, IonCard, IonContent, IonCardHeader, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, useIonViewDidEnter, useIonLoading, useIonViewDidLeave } from '@ionic/react';
import './style.css';
import api from '../../services/Api';
import React, { useEffect, useState } from 'react';
import Loading from '../../components/loading';
import { useLocation } from 'react-router';



const ServerOffline : React.FC = () => {
    const [loading, setLoading] = useState('none');
    const location = useLocation();
    const [redirekt, setRedirekt] = useState(new URLSearchParams(location.search).get('redirekt'));



    useIonViewDidEnter(() => {
        checkServer();
        setInterval(checkServer, 10000);
    })

    function checkServer(){ 
        setLoading('loading');
        api.healthCheck()
        .then((response) => {
            setLoading('success');
            if(redirekt != ''){
                window.location.href = decodeURIComponent(redirekt!);
            }
            else {
                window.location.href = "/auth/login";
            }
        })
        .catch((error) => {
            setLoading('error');
        });
    }
    
    
    
    return (
        <IonPage>
            <IonContent fullscreen className="background">
                <div className="errorgrid">
                    <IonCard className="card" color="danger">
                        <IonCardHeader>
                            <IonCardTitle><h1>Server is not Responding</h1></IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <p>Something went wrong!</p>
                            <p>We are sorry. The Server is currently unavailable.</p>
                        </IonCardContent>
                        <IonCardContent>
                            <p>We are constantly checking if the server is back up and running:</p>
                            
                            <IonCard color="medium">
                                <IonCardContent>
                                    <Loading slot="start" status={loading}></Loading>
                                    <p>{loading == 'loading' ? "Checking server..." : ""}</p>
                                    <p>{loading == 'success' ? "Server connection successfull. Redirecting..." : ""}</p>
                                    <p>{loading == 'error' ? "Server still not available. Retrying in 10 seconds..." : ""}</p>
                                </IonCardContent>
                            </IonCard>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ServerOffline;
