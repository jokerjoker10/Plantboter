import { IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton } from '@ionic/react';
import { ellipsisVerticalOutline, personOutline, logOutOutline, settingsOutline, hardwareChipOutline } from 'ionicons/icons';
import './style.css';

const Log: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons>
                        <IonBackButton defaultHref="/">Back</IonBackButton>
                        <IonTitle>Log</IonTitle>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="background">
                
            </IonContent>
        </IonPage>
    );
};

export default Log;