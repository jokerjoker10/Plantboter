import { IonButton, IonCard, IonCardContent, IonIcon, IonItem, IonList, IonListHeader } from '@ionic/react';
import { codeOutline, enterOutline, exitOutline, keyOutline, trashBinOutline } from 'ionicons/icons';
import React from 'react';

const ControllerSettingsPopover: React.FC<{
    onHide: () => void;
}> = ({ onHide }) => {    
    return (
        <IonList>
            <IonListHeader>Contoller Actions</IonListHeader>
            <IonItem button><IonIcon icon={keyOutline}></IonIcon>Api Key : TODO</IonItem>
            <IonItem button><IonIcon icon={codeOutline}></IonIcon>Generate Config : TODO</IonItem>
            <IonItem button><IonIcon icon={exitOutline}></IonIcon>Export Controller : TODO</IonItem>
            <IonItem button><IonIcon icon={enterOutline}></IonIcon>Import Controller : TODO</IonItem>
            <IonItem button color="danger"><IonIcon icon={trashBinOutline}></IonIcon>Delete Controller : TODO</IonItem>
        </IonList>
    );
};

export default ControllerSettingsPopover;