import { IonMenu, IonCard, IonContent, IonHeader, IonButtons, IonPage, IonTitle, IonToolbar, IonCardContent, IonList, IonItem, IonRouterOutlet, IonCardSubtitle, IonCardTitle, IonImg, useIonViewDidEnter, useIonLoading, IonMenuButton, IonMenuToggle, useIonModal, IonBackButton, IonCardHeader, IonRange, IonLabel, IonButton, IonInput, IonIcon, IonGrid, IonRow, IonCol, useIonPopover } from '@ionic/react';
import './style.css';
import api from '../../services/Api';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { AxiosError } from 'axios';
import ErrorModal from '../../components/errormodal';
import { ControllerModel } from '../../model/controller.model';
import { SettingsModel } from '../../model/settings.model';
import timeService from '../../services/time';
import { ellipsisVerticalOutline, saveOutline } from 'ionicons/icons';
import ControllerSettingsPopover from '../../components/settings/contollersettingspopover';
import Loading from '../../components/loading';

interface ControllerSettingsProps extends RouteComponentProps<{
    controller: string;
}> { }

const ControllerSettings: React.FC<ControllerSettingsProps> = ({ match }) => {
    
    // error Handling
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

    // action popover
    const [showPopover, dismissPopover] = useIonPopover(ControllerSettingsPopover, { onHide: () => dismissPopover() });

    //Controller Save
    const [controllerSaveLoading, setControllerSaveLoading] = useState('none');
    function handleSaveController(){
        setControllerSaveLoading('loading'); 
        api.controller.updateController({name: name, cycle_time: cycle_time}, Number(controller?.id))
        .then((data) => {
            setControllerSaveLoading('success'); 
            getControllerData();
        })
        .catch((error) => {
            setControllerSaveLoading('error'); 
            setError(error);
        });
    }

    // backend requests
    const [controller, setController] = useState<ControllerModel>();
    const [name, setName] = useState<string>();
    const [cycle_time, setCycleTime] = useState<number>();
    const [settings, setSettings] = useState<SettingsModel>();
    useIonViewDidEnter(() => {
        api.getSettings()
            .then((response) => {
                setSettings(response.data.settings);
            })
            .catch((error) => {
                setError(error);
            });
        
        getControllerData();
            
    }, []);

    function getControllerData(){
        api.controller.getControllerInfo({ controller_id: match.params.controller })
        .then((response) => {
            setController(response.data.controller);
            setName(response.data.controller.name);
            setCycleTime(response.data.controller.cycle_time);
        })
        .catch((error) => {
            setError(error);
        });
    }

    return (
        <IonPage>
            <IonToolbar>
                <IonButtons>
                    <IonBackButton defaultHref="/settings">Back</IonBackButton>
                    <IonTitle>Settings</IonTitle>
                </IonButtons>
                <IonButtons slot="end">
                    <IonButton onClick={e => showPopover()}>
                        <IonIcon slot="icon-only" icon={ellipsisVerticalOutline}></IonIcon>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <IonContent fullscreen className="background">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardContent>
                        <p>Controller Config</p>
                        <IonItem>
                            <IonLabel>Name:</IonLabel>
                            <IonInput value={name} onIonChange={e => setName(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Cycle Time: </IonLabel>
                            <IonRange
                                min={settings?.settings.controller.cycle_time.min}
                                max={settings?.settings.controller.cycle_time.max}
                                value={cycle_time}
                                step={60000}
                                onIonChange={e => setCycleTime(Number(e.detail.value))}>
                                <IonLabel slot="end">
                                    {timeService.timeToString(cycle_time!)}
                                </IonLabel>
                            </IonRange>
                        </IonItem>
                        <IonButton onClick={handleSaveController}>
                            <IonIcon icon={saveOutline}></IonIcon>
                            Save
                            <Loading slot="end" status={controllerSaveLoading}></Loading>
                        </IonButton>
                    </IonCardContent>
                </IonCard>

                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>Plants</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonButton fill="outline">Add Plant : TODO</IonButton>
                                    <IonList>
                                       
                                    </IonList>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default ControllerSettings;
