import { IonFab, IonIcon, IonBackButton, IonContent, IonHeader, IonButtons, IonPage, IonTitle, IonToolbar, IonFabButton, IonList, IonItem, IonRouterOutlet, IonCardSubtitle, IonCardTitle, useIonModal, useIonViewDidEnter, useIonLoading, IonMenuButton, IonMenuToggle } from '@ionic/react';
import './style.css';
import { addOutline } from 'ionicons/icons';
import api from '../../services/Api';
import React, { useState } from 'react';
import ControllerCard from '../../components/settings/controllercard';
import { ControllerModel } from '../../model/controller.model';
import { AxiosError } from 'axios';
import ErrorModal from '../../components/errormodal';

const Settings: React.FC = () => {
    const [controller_list, set_controller_list] = useState<Array<ControllerModel>>()

    const [error, set_error] = useState<AxiosError>();
    const [present_error, dismiss_error] = useIonModal(ErrorModal, {
        error,
        onDismissError: onDismissError
    });
    function onDismissError() {
        dismiss_error();
    }
    function setError(error: AxiosError) {
        set_error(error);
        present_error();
    }

    useIonViewDidEnter(() => {
        getController();
    }, []);

    function getController() {
        api.controller.getControllerList()
        .then((response) => {
            set_controller_list(response.data.controller_list);
        })
        .catch((error) => {
            setError(error);
        });
    }

    function addController() {
        api.controller.createController({})
            .then((response) => {
                getController();
            })
            .catch((error) => {
                setError(error);
            });
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons>
                        <IonBackButton defaultHref="/">Back</IonBackButton>
                        <IonTitle>Settings</IonTitle>
                    </IonButtons>
                </IonToolbar>
                <IonFab vertical="top" horizontal="end">
                    <IonFabButton onClick={e => addController()}>
                        <IonIcon icon={addOutline}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonHeader>
            <IonContent fullscreen className="background">
                <div className="controller_grid">
                    {controller_list?.map((controller: ControllerModel) => {
                        return(
                            <ControllerCard controller={controller} key={Number(controller.id)}></ControllerCard>
                        )
                    })}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Settings;
