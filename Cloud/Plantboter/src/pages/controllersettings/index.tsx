import { IonMenu, IonCard, IonContent, IonHeader, IonButtons, IonPage, IonTitle, IonToolbar, IonCardContent, IonList, IonItem, IonRouterOutlet, IonCardSubtitle, IonCardTitle, IonImg, useIonViewDidEnter, useIonLoading, IonMenuButton, IonMenuToggle, useIonModal, IonBackButton, IonCardHeader, IonRange, IonLabel, IonButton, IonInput, IonIcon, IonGrid, IonRow, IonCol, useIonPopover, IonSelect, IonSelectOption, IonToggle } from '@ionic/react';
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
import { PlantListModel } from '../../model/plantlist.model';
import { PlantModel } from '../../model/plant.model';

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
    function handleSaveController() {
        setControllerSaveLoading('loading');
        api.controller.updateController({ name: name, cycle_time: cycle_time }, Number(controller?.id))
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

    function getControllerData() {
        api.controller.getControllerInfo(Number(match.params.controller))
            .then((response) => {
                setController(response.data.controller);
                setName(response.data.controller.name);
                setCycleTime(response.data.controller.cycle_time);
                loadPlantList(response.data.controller);
            })
            .catch((error) => {
                setError(error);
            });
    }

    const [plant_list, setPlantList] = useState<Array<PlantListModel>>();
    function loadPlantList(controller: ControllerModel) {
        api.plants.getPlantsOfController(controller.id)
            .then((plants) => {
                setPlantList(plants.data.plants);
            })
            .catch((error) => {
                setError(error);
            });
    }

    const [add_plant_loading, setAddPlantLoading] = useState('none');
    function addPlant() {
        setAddPlantLoading('loading');
        api.plants.createPlant({ controller_id: controller!.id })
            .then((data) => {
                setAddPlantLoading('success');
                loadPlantList(controller!);
            })
            .catch((error) => {
                setAddPlantLoading('error');
                setError(error);
            });
    }


    const [show_plant_settings, setShowPlantSettings] = useState(false);
    const [plant, setPlant] = useState<PlantModel>();
    function loadPlantSettings(id: Number) {
        api.plants.getPlantInfo(id)
            .then((plant) => {
                setPlant(plant.data.plant);
                setShowPlantSettings(true);
            })
            .catch((error) => {
                setError(error);
            })
    }

    function changeType(type: String) {
        var tmp_plant = plant;
        tmp_plant!.sensor_type = type;
        setPlant(tmp_plant);
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
                        <p>Plant UID: {controller?.id}</p>
                        <p>Created at: {timeService.dateToString(controller?.createdAt!)}</p>
                        <p>Last update at: {timeService.dateToString(controller?.updatedAt!)}</p>
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
                            <IonLabel>Cycle Time: {timeService.timeToString(cycle_time!)}</IonLabel>
                            <IonRange
                                min={settings?.settings.controller.cycle_time.min}
                                max={settings?.settings.controller.cycle_time.max}
                                value={cycle_time}
                                step={60000}
                                onIonChange={e => setCycleTime(Number(e.detail.value))}>
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
                                    <IonButton fill="outline" onClick={addPlant}>Add Plant<Loading slot='end' status={add_plant_loading}></Loading></IonButton>
                                    <IonList>
                                        {plant_list?.map((plant: PlantListModel) => (
                                            <IonItem detail={true} button key={Number(plant.id)} onClick={e => loadPlantSettings(plant.id)}>{plant.name}</IonItem>
                                        ))}
                                    </IonList>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol>
                            {show_plant_settings ? (
                                <IonCard>
                                    <IonCardHeader>
                                        <IonCardTitle>{plant?.name}</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonItem>
                                            <IonLabel position="floating">Name</IonLabel>
                                            <IonInput value={String(plant?.name) || ''}></IonInput>
                                        </IonItem>
                                        <p>Plant UID: {plant?.id}</p>
                                        <p>Created at: {timeService.dateToString(plant?.createdAt!)}</p>
                                        <p>Last Update at: {timeService.dateToString(plant?.updatedAt!)}</p>
                                    </IonCardContent>
                                    <IonCardContent>
                                        <IonItem>
                                            <IonLabel position="floating">Sensor Type</IonLabel>
                                            <IonSelect value={plant?.sensor_type} onIonChange={e => changeType(e.detail.value)}>
                                                <IonSelectOption value="analog">Analog</IonSelectOption>
                                                <IonSelectOption value="digital">Digital</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Sensor Pin</IonLabel>
                                            <IonInput value={Number(plant?.sensor_pin)} type="number" step="1"></IonInput>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Trigger Percentage</IonLabel>
                                            <IonRange
                                                min={settings?.settings.plants.trigger_percentage.min}
                                                max={settings?.settings.plants.trigger_percentage.max}
                                                value={Number(plant?.trigger_percentage)}
                                                step={1}>
                                            </IonRange>
                                            <p slot="end">{plant?.trigger_percentage}</p>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Pump Pin</IonLabel>
                                            <IonInput value={Number(plant?.pump_pin)} type="number" step="1"></IonInput>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Pump Time</IonLabel>
                                            <IonRange
                                                min={settings?.settings.plants.pump_time.min}
                                                max={settings?.settings.plants.pump_time.max}
                                                value={Number(plant?.pump_time)}
                                                step={1}>
                                            </IonRange>
                                            <p slot="end">{timeService.timeToString(Number(plant?.pump_time))}</p>
                                        </IonItem>
                                    </IonCardContent>
                                </IonCard>
                            ) : <></>}
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default ControllerSettings;
