import React, { useState } from 'react';
import { IonCard, IonCardTitle, IonRow, IonCol, IonRange, IonLabel, IonItem, IonCardHeader, IonList, IonCardContent,useIonPopover,IonIcon, IonButton, IonInput, IonText, useIonLoading, IonCheckbox, IonListHeader, IonGrid, IonSelect, IonSelectOption } from '@ionic/react';
import {getAllController, getLog, getLang, plant, updatePlant, plantUpdate} from '../../scripts/superStore';
import {addOutline, optionsOutline, leafOutline, imageOutline, closeCircleOutline, saveOutline, trashBinOutline} from 'ionicons/icons';
import './DisplayController.css'


var lang = getLang();
var controllers = getAllController();

interface ContainerProps {
    plantData: plant;
}

function uploadImage(){

}

function deleteImage(){

}

function imageButtons(img: any){
    return(
        <>
            <div className="settingsImageContainer">
                <img src={img} className="settingsImage"/>
            </div>

            <div className="imageUpload">
                <input type='file' id='multi' accept=".jpg,.png" multiple capture="picture" onChange={e => console.log(e)}/>
            </div>
        </>
    )
}

const SettingsPopover: React.FC<{onHide: () => void;plant: plant;}> = ({onHide, plant}) => (
    <IonList>
        
        <IonItem lines="none" button detail={false} href= {"/danger/delete_plant/" + plant.log}>
            <div className="popoverdanger">
                <IonIcon icon={trashBinOutline}></IonIcon>
                {lang.settings.controller.plants.removePlant}
            </div>
        </IonItem>
        
    </IonList>
)

const DisplayPlantSettings: React.FC<ContainerProps> = ({plantData}) => {
    const [settingsShow, settingsUnshow] = useIonPopover(SettingsPopover, {onHide: () => settingsUnshow(), plant: plantData});
    const [loadingCircle] = useIonLoading();

    const [name, setName] = useState(plantData.name);
    const [sensorType, setSensorType] = useState<string>(plantData.sensor_type);
    const [pumpPin, setPumpPin] = useState(plantData.pump_pin);
    const [sensorPin, setSensorPin] = useState<number>(plantData.sensor_pin);
    const [percentage, setPercentage] = useState(plantData.trigger_percentage);
    const [pumpTime, setPumpTime] = useState(plantData.pump_time);

    function handleSaveController(){
        if(sensorType != undefined && pumpPin != undefined && sensorPin != undefined && name != ""){
            loadingCircle();

            var updatedData: plantUpdate = {
                name: name,
                img: "",
                sensor_pin: sensorPin,
                sensor_type: sensorType,
                pump_pin: pumpPin,
                trigger_percentage: percentage,
                pump_time: pumpTime
            }

            updatePlant(plantData.log, updatedData)
            .finally(() => {
                window.location.href = "/settings"
            })
        }
    }

    return (
        <>
            <IonCard className="plantSettingCard controllerCard">

                <IonCardHeader>

                    <IonCardTitle>

                        <IonIcon icon={leafOutline}></IonIcon> 
                        {name != "" ? name : "<NONE>"}
                        <IonIcon icon={optionsOutline} size="large" style={{float:"right",color:"white"}} onClick={(e) => settingsShow({event: e.nativeEvent})}></IonIcon>

                    </IonCardTitle>
                
                </IonCardHeader>
                
                <IonCardContent>
                    <form>
                        {/*
                            <IonItem>
                                <div className="settingListElement">
                                    {imageButtons(plantData.img)}
                                </div>
                            </IonItem>
                        */}

                        {/* Plant name*/}
                        <IonItem lines="inset">
                            <IonLabel position="floating">{lang.settings.controller.plants.plantName}:</IonLabel>
                            <IonInput value={name} required onIonChange={e => setName(e.detail.value!)}></IonInput>
                        </IonItem>

                        {/* Sensor */}
                        <IonItem lines="inset">
                            <IonLabel position="floating">{lang.settings.controller.plants.sensorPin}</IonLabel>
                            <IonInput type="number" required min="0" max="255" step="1" value={sensorPin} onIonChange={e => setSensorPin(Number(e.detail.value))}></IonInput>
                        </IonItem>

                        {/* Sensor Typ */}
                        <IonItem lines="inset">
                            <IonLabel position="floating">Sensor Type</IonLabel>
                            <IonSelect onIonChange={e => setSensorType(e.detail.value)} value={sensorType}>
                                <IonSelectOption value={"digital"}>Digital</IonSelectOption>
                                <IonSelectOption value={"analog"}>Analog</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        {/* Sensor */}
                        <IonItem lines="inset">
                            <IonLabel position="floating">{lang.settings.controller.plants.triggerPercentage}</IonLabel>
                            <IonRange disabled={sensorType != "analog" ? true : false} min={0} step={1} max={100} value={percentage} onIonChange={e => setPercentage(e.detail.value as number)}>
                                <IonLabel slot="end">{percentage}%</IonLabel>
                            </IonRange>
                        </IonItem>

                        {/* Pump */}
                        <IonItem lines="inset">
                            <IonLabel position="floating">{lang.settings.controller.plants.pumpPin}:</IonLabel>
                            <IonInput type="number" required min="0" max="255" step="1" value={pumpPin} onIonChange={e => setPumpPin(Number(e.detail.value))}></IonInput>
                        </IonItem>


                        {/* Pump */}
                        <IonItem lines="inset">
                            <IonLabel position="floating">{lang.settings.controller.plants.pumpTime}:</IonLabel>
                            <IonInput onIonChange={e => setPumpTime(Number(e.detail.value))} value={pumpTime} type="number" step="1" min="0" required></IonInput>
                        </IonItem>

                        <IonButton type="submit" slot="bottom" color="success" onClick={handleSaveController}>
                            <IonIcon icon={saveOutline}></IonIcon>
                            {lang.settings.controller.plants.saveSetting}
                        </IonButton>

                    </form>

                </IonCardContent>
            </IonCard>
        </>
    )
}
export default DisplayPlantSettings
