import { IonButtons, IonBackButton, IonContent, IonIcon, IonItem, IonCard, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, useIonViewDidEnter } from '@ionic/react';
import './style.css';
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useHistory, useLocation } from 'react-router';
import { logoGithub, mailOutline, returnDownBack } from 'ionicons/icons';

interface PageProps {
    axios_error: AxiosError;
}

const ErrorPage: React.FC<PageProps> = ({axios_error}) => {
    const [error, setError] = useState<any>({});
    const [redirekt, setRedirekt] = useState("");
    
    const location = useLocation();
    const history = useHistory();

    function sendMail() {
        var mailError = error;

        var text = "Hello.\nThank you for Mailing this issue to us. \nIf possible please send this mail with the same address your account is registered with.\n\n";
        window.open("mailto:errors@plantboter.net?subject=Error&body=" + encodeURIComponent(text) + JSON.stringify(error, undefined, 2))
    }

    function openGitHub() {
        window.open("https://github.com/jokerjoker10/Plantboter/issues");
    }

    useEffect(() => {
        var redirekt = new URLSearchParams(location.search).get('redirekt') || '';
        setRedirekt(decodeURIComponent(redirekt));

        var _error = new URLSearchParams(location.search).get('error') || '';
        
        setError(JSON.parse(decodeURIComponent(_error)));
        
        console.log(error);
    }, []);

    if(error?.response){
        return (
            <div color="warning">

                <IonItem color="danger">
                    <h1>Error! {error?.response?.status || ""}:{error?.response?.statusText || ""}</h1>
                </IonItem>

                {console.log(error)}
                <IonCard className="codecard">
                    <IonCardContent>
                        <pre>
                            {JSON.stringify(error?.response?.data, undefined, 2) || ""}
                        </pre>
                    </IonCardContent>
                </IonCard>
                <div className="button_panel">
                    <IonButton onClick={e => openGitHub()} >Report Issue on GitHub<IonIcon icon={logoGithub}></IonIcon></IonButton>
                    <IonButton onClick={e => sendMail()} fill="outline">Report Issue by Mail<IonIcon icon={mailOutline}></IonIcon></IonButton>
                    <IonButton onClick={e => window.location.href = redirekt} fill="outline">Go Back</IonButton>
                </div>

            </div>
        );
    }

    return(
        <div color="warning">

                <IonItem color="danger">
                    <h1>Error!  {error.message}</h1>
                </IonItem>

                {console.log(error)}
                <IonCard>
                    <IonCardContent>
                        <pre>
                            {JSON.stringify(error, undefined, 2)}
                        </pre>
                    </IonCardContent>
                </IonCard>
                <div className="button_panel">
                    <IonButton onClick={e => openGitHub()} >Report Issue on GitHub<IonIcon icon={logoGithub}></IonIcon></IonButton>
                    <IonButton onClick={e => sendMail()} fill="outline">Report Issue by Mail<IonIcon icon={mailOutline}></IonIcon></IonButton>
                    <IonButton onClick={e => window.location.href = redirekt} fill="outline">Go Back</IonButton>
                </div>

            </div>
    );
};

export default ErrorPage;
