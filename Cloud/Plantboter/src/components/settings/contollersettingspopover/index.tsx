import { IonButton, IonCard, IonCardContent, IonIcon, IonItem, IonList, IonListHeader, useIonModal,  } from '@ionic/react';
import { codeOutline, enterOutline, exitOutline, keyOutline, trashBinOutline } from 'ionicons/icons';
import React from 'react';
import ApiModal from '../apimodal';

const ControllerSettingsPopover: React.FC<{
    controller_id: Number;
    onHide: () => void;
}> = ({ onHide, controller_id }) => {
    const [openApiPopover, dismiss] = useIonModal(ApiModal, { onDismiss: () => dismiss(), controller_id: controller_id });
    return (
        <IonList>
            <IonListHeader>Contoller Actions</IonListHeader>
            <IonItem button onClick={e => openApiPopover()}><IonIcon icon={keyOutline}></IonIcon>Api Key</IonItem>
            <IonItem button color="danger"><IonIcon icon={trashBinOutline}></IonIcon>Delete Controller : TODO</IonItem>
        </IonList>
    );
};

export default ControllerSettingsPopover;