import React, { useState } from 'react';
import { IonCard, IonCardTitle, IonRange, IonLabel, IonItem, IonCardHeader, IonCol, IonRow, IonCardContent,IonGrid,IonIcon, IonButton, IonInput, IonText, useIonLoading } from '@ionic/react';
import {getAllController, getLog, getLang, plant, updatePlant, plantUpdate} from '../../scripts/superStore';
import {addOutline, hardwareChipOutline, leafOutline, imageOutline, closeCircleOutline, saveOutline, trashBinOutline} from 'ionicons/icons';
import './DisplayController.css'
import { NetworkPluginWeb } from '@capacitor/core';


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

const DisplayPlantSettings: React.FC<ContainerProps> = ({plantData}) => {
    
    const [percentage, setPercentage] = useState(plantData.trigger_percentage);
    const [pump, setPump] = useState(plantData.pump_pin);
    const [sensor, setSensor] = useState<number>(plantData.sensor_pin);
    const [name, setName] = useState(plantData.name);

    const [loadingCircle] = useIonLoading();
    
    function handleSaveController(){
        loadingCircle();

        var updatedData: plantUpdate = {
            name: name,
            img: "",
            sensor_pin: sensor,
            pump_pin: pump,
            trigger_percentage: percentage
        }

        updatePlant(plantData.log._id, updatedData).finally(() => {
            window.location.href = "/settings"
        })
    }

    return (
        <>
            <IonCard className="plantSettingCard controllerCard">
                <IonCardHeader>
                    <IonCardTitle>
                        <IonIcon icon={leafOutline}></IonIcon> {name}
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonItem>
                        <div className="settingListElement">
                            {imageButtons(plantData.img)}
                        </div>
                    </IonItem>

                    <IonText>{lang.settings.controller.plants.plantName}:</IonText>
                    <IonItem>
                        <IonInput value={name} onIonChange={e => setName(e.detail.value!)}></IonInput>
                    </IonItem>
                    
                    <IonText>{lang.settings.controller.plants.sensorPin}:</IonText>
                    <IonItem>
                        <IonInput type="number" min="0" max="255" step="1" value={sensor} onIonChange={e => setSensor(Number(e.detail.value))}></IonInput>
                    </IonItem>
                    
                    <IonText>{lang.settings.controller.plants.pumpPin}:</IonText>
                    <IonItem>
                        <IonInput type="number" min="0" max="255" step="1" value={pump} onIonChange={e => setPump(Number(e.detail.value))}></IonInput>
                    </IonItem>

                    <IonText>{lang.settings.controller.plants.triggerPercentage}</IonText>
                    <IonItem>
                        <IonRange min={0} step={1} max={100} value={percentage} onIonChange={e => setPercentage(e.detail.value as number)}>
                            <IonLabel slot="end">{percentage}%</IonLabel>
                        </IonRange>
                    </IonItem>
                    <IonButton slot="bottom" color="success" onClick={handleSaveController}>{lang.settings.controller.plants.saveSetting}<IonIcon icon={saveOutline}></IonIcon></IonButton>
                    <IonButton slot="bottom" color="danger" href={"/danger/delete_plant/" + plantData.log._id}><IonIcon icon={trashBinOutline}></IonIcon></IonButton>
                </IonCardContent>
            </IonCard>
        </>
    )
}
export default DisplayPlantSettings
