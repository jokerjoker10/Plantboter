import { IonSpinner, IonIcon } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';


interface ContainerProps { }

const Loading = ({status, slot}: any) => {
  return (
    <div slot={slot}>
        <IonSpinner name="crescent" style={{ display: status == 'loading' ? "block" : "none" }}></IonSpinner>
        <IonIcon icon={closeOutline} style={{ display: status == 'error' ? "block" : "none" }}></IonIcon>
        <IonIcon icon={checkmarkOutline} style={{ display: status == 'success' ? "block" : "none" }}></IonIcon>
    </div>
  );
};

export default Loading;