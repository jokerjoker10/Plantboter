import { IonButton, IonCard, IonCardContent } from '@ionic/react';
import { AxiosError } from 'axios';
import React from 'react';

const ErrorModal: React.FC<{
    error: AxiosError;
    onDismissError: () => void;
}> = ({ error, onDismissError }) => {
    function sendMail(){
        var mailError = error;
        mailError.config.headers["x-access-token"] = null;

        var text = "Hello.\nThank you for Mailing this issue to us. \nIf possible please send this mail with the same address your account is registered with.\n\n";
        window.open("mailto:errors@plantboter.net?subject=Error&body=" + encodeURIComponent(text) + JSON.stringify(mailError, undefined, 2))
    }
    
    return (
        <div color="warning">

            <h1>Error! {error.response?.status}:{error.response?.statusText}</h1>

            {console.log(error)}
            <IonCard>
                <IonCardContent>
                    <pre>
                        {JSON.stringify(error.response?.data, undefined, 2)}
                    </pre>
                </IonCardContent>
            </IonCard>

            <IonButton onClick={e => sendMail()}>Report Issue by Mail</IonButton>
            <IonButton color="medium" onClick={e => onDismissError()}>Continue Anyway</IonButton>
        </div>
    );
};

export default ErrorModal;