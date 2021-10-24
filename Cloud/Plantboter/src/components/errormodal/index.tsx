import { IonButton, IonCard, IonCardContent, IonIcon, IonItem } from '@ionic/react';
import { AxiosError } from 'axios';
import { logoGithub, mailOutline } from 'ionicons/icons';
import React from 'react';
import './style.css';

const ErrorModal: React.FC<{
    error: AxiosError;
    onDismissError: () => void;
}> = ({ error, onDismissError }) => {
    function sendMail() {
        var mailError = error;
        mailError.config.headers["x-access-token"] = null;

        var text = "Hello.\nThank you for Mailing this issue to us. \nIf possible please send this mail with the same address your account is registered with.\n\n";
        window.open("mailto:errors@plantboter.net?subject=Error&body=" + encodeURIComponent(text) + JSON.stringify(mailError, undefined, 2))
    }

    function openGitHub() {
        window.open("https://github.com/jokerjoker10/Plantboter/issues");
    }

    return (
        <div color="warning">

            <IonItem color="danger">
                <h1>Error! {error.response?.status}:{error.response?.statusText}</h1>
            </IonItem>

            {console.log(error)}
            <IonCard>
                <IonCardContent>
                    <pre>
                        {JSON.stringify(error.response?.data, undefined, 2)}
                    </pre>
                </IonCardContent>
            </IonCard>
            <div className="button_panel">
                <IonButton onClick={e => openGitHub()} >Report Issue on GitHub<IonIcon icon={logoGithub}></IonIcon></IonButton>
                <IonButton onClick={e => sendMail()} fill="outline">Report Issue by Mail<IonIcon icon={mailOutline}></IonIcon></IonButton>
                <IonButton onClick={e => onDismissError()} fill="outline">Continue Anyway</IonButton>
            </div>

        </div>
    );
};

export default ErrorModal;