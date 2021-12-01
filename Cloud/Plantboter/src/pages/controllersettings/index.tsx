import { IonCard, IonContent, IonButtons, IonPage, IonTitle, IonToolbar, IonCardContent, IonList, IonItem, IonCardTitle, useIonViewDidEnter, IonBackButton, IonCardHeader, IonRange, IonLabel, IonButton, IonInput, IonIcon, IonGrid, IonRow, IonCol, useIonPopover, IonSelect, IonSelectOption } from '@ionic/react';
import './style.css';
import api from '../../services/Api';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useLocation } from 'react-router';
import { ControllerModel } from '../../model/controller.model';
import { SettingsModel } from '../../model/settings.model';
import timeService from '../../services/time';
import { ellipsisVerticalOutline, saveOutline, trashBinOutline } from 'ionicons/icons';
import ControllerSettingsPopover from '../../components/settings/contollersettingspopover';
import Loading from '../../components/loading';
import { PlantListModel } from '../../model/plantlist.model';
import { PlantModel } from '../../model/plant.model';

interface ControllerSettingsProps extends RouteComponentProps<{
    controller: string;
}> { }

const ControllerSettings: React.FC<ControllerSettingsProps> = ({ match }) => {    // action popover
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
                console.log(error);
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
                console.log(error);
            });

        getControllerData();

    }, []);

    const [showPopover, dismissPopover] = useIonPopover(ControllerSettingsPopover, { onHide: () => dismissPopover(), controller_id: controller?.id });

    function getControllerData() {
        api.controller.getControllerInfo(Number(match.params.controller))
            .then((response) => {
                setController(response.data.controller);
                setName(response.data.controller.name);
                setCycleTime(response.data.controller.cycle_time);
                loadPlantList(response.data.controller);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const [plant_list, setPlantList] = useState<Array<PlantListModel>>();
    function loadPlantList(controller: ControllerModel) {
        api.plants.getPlantsOfController(controller.id)
            .then((plants) => {
                setPlantList(plants.data.plants);
            })
            .catch((error) => {
                console.log(error);
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
                console.log(error);
            });
    }

    // load plant
    const [show_plant_settings, setShowPlantSettings] = useState(false);
    const [plant, setPlant] = useState<PlantModel>();
    function loadPlantSettings(id: Number) {
        api.plants.getPlantInfo(id)
            .then((plant) => {
                setPlant(plant.data.plant);
                setShowPlantSettings(true);
                
                setPlantName(plant.data.plant.name);
                setPlantSensorType(plant.data.plant.sensor_type);
                setPlantSensorPin(plant.data.plant.sensor_pin);
                setPlantTriggerPercentage(plant.data.plant.trigger_percentage);
                setPlantPumpPin(plant.data.plant.pump_pin);
                setPlantPumpTime(plant.data.plant.pump_time);

                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?plant=' + id;
                window.history.pushState({path:newurl},'',newurl);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // save plant
    const [plant_name, setPlantName] = useState<String>()
    const [plant_sensor_type, setPlantSensorType] = useState<String>();
    const [plant_sensor_pin, setPlantSensorPin] = useState<Number>();
    const [plant_trigger_percentage, setPlantTriggerPercentage] = useState<Number>();
    const [plant_pump_pin, setPlantPumpPin] = useState<Number>();
    const [plant_pump_time, setPlantPumpTime] = useState<Number>();

    const [update_plant_loading, setUpdatePlantLoading] = useState<String>("none");

    function savePlant(){
        setUpdatePlantLoading("loading");
        var data = {
            plant_id: plant?.id,
            name: plant_name,
            sensor_pin: plant_sensor_pin,
            pump_pin: plant_pump_pin,
            trigger_percentage: plant_trigger_percentage,
            sensor_type: plant_sensor_type,
            pump_time: plant_pump_time
        }

        var defaults = settings?.settings.plants;

        if (!data.name) {
            data.name = String(defaults?.default_name);
        }
        if (!data.sensor_pin) {
            data.sensor_pin = defaults?.default_sensor_pin
        }
        if (!data.pump_pin) {
            data.pump_pin = defaults?.default_pump_pin
        }
        if (!data.trigger_percentage || data.trigger_percentage < defaults?.trigger_percentage.min! || data.trigger_percentage > defaults?.trigger_percentage.max!) {
            data.trigger_percentage = defaults?.trigger_percentage.default;
        }
        if (!data.pump_time || data.pump_time < defaults?.pump_time.min! || data.pump_time > defaults?.pump_time.max!) {
            data.pump_time = defaults?.pump_time.default;
        }
        if (!data.sensor_type || data.sensor_type != ("digital" || "analog")) {
            data.sensor_type = String(defaults?.default_sensor_type);
        }
        
        api.plants.updatePlant(data)
        .then((response) => {
            setUpdatePlantLoading("success");
            loadPlantSettings(data.plant_id!);
        })
        .catch((error) => {
            setUpdatePlantLoading("error");
            console.log(error);
        })
    }

    // load plant throug query parameter
    const location = useLocation();
    const [query_plant, setQueryPlant] = useState<any>(null);
    useEffect(() => {
        setQueryPlant(new URLSearchParams(location.search).get('plant') || null);
    }, []);

    if(query_plant != null && !plant){
        loadPlantSettings(Number(query_plant));
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
                        <p>Controller UID: {controller?.id}</p>
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
                                min={Number(settings?.settings.controller.cycle_time.min)}
                                max={Number(settings?.settings.controller.cycle_time.max)}
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
                                        <IonCardTitle>{plant_name}</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonButton onClick={e => savePlant()}>
                                            <IonIcon icon={saveOutline}></IonIcon>
                                            Save
                                            <Loading slot="end" status={update_plant_loading}></Loading>
                                        </IonButton>
                                        <IonButton color="danger">
                                            <IonIcon icon={trashBinOutline}></IonIcon>
                                            Delete : TODO
                                            <Loading slot="end" status={controllerSaveLoading}></Loading>
                                        </IonButton>
                                    </IonCardContent>
                                    <IonCardContent>
                                        <p>Plant UID: {plant?.id}</p>
                                        <p>Created at: {timeService.dateToString(plant?.createdAt!)}</p>
                                        <p>Last Update at: {timeService.dateToString(plant?.updatedAt!)}</p>
                                    </IonCardContent>
                                    <IonCardContent>
                                        <IonItem>
                                            <IonLabel position="floating">Name</IonLabel>
                                            <IonInput value={String(plant_name!)} onIonChange={e => setPlantName(e.detail.value!)}></IonInput>
                                        </IonItem>
                                    </IonCardContent>
                                    <IonCardContent>
                                        <IonItem>
                                            <IonLabel position="floating">Sensor Type</IonLabel>
                                            <IonSelect value={plant_sensor_type} onIonChange={e => setPlantSensorType(e.detail.value)}>
                                                <IonSelectOption value="analog">Analog</IonSelectOption>
                                                <IonSelectOption value="digital">Digital</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Sensor Pin</IonLabel>
                                            <IonInput value={Number(plant_sensor_pin)} type="number" step="1" onIonChange={e => setPlantSensorPin(Number(e.detail.value))}></IonInput>
                                        </IonItem>
                                        <IonItem>
                                            
                                            <IonLabel position="floating">
                                                Trigger Percentage: {plant_trigger_percentage}%
                                            </IonLabel>
                                            <IonRange
                                                min={Number(settings?.settings.plants.trigger_percentage.min)}
                                                max={Number(settings?.settings.plants.trigger_percentage.max)}
                                                value={Number(plant_trigger_percentage)}
                                                step={1}
                                                disabled={plant_sensor_type == "digital"}
                                                onIonChange={e => setPlantTriggerPercentage(Number(e.detail.value!))}>
                                            </IonRange>
                                            
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Pump Pin</IonLabel>
                                            <IonInput value={Number(plant_pump_pin)} type="number" step="1" onIonChange={e => setPlantPumpPin(Number(e.detail.value!))}></IonInput>
                                        </IonItem>
                                        <IonItem>

                                            <IonLabel position="floating">
                                                Pump Time: {timeService.timeToString(Number(plant_pump_time))}
                                            </IonLabel>
                                            <IonRange
                                                min={Number(settings?.settings.plants.pump_time.min)}
                                                max={Number(settings?.settings.plants.pump_time.max)}
                                                value={Number(plant_pump_time)}
                                                step={1}
                                                onIonChange={e => setPlantPumpTime(Number(e.detail.value!))}>
                                            </IonRange>

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
