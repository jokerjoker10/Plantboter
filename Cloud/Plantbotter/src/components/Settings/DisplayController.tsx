import React, { useState } from 'react';
import { IonCard, IonCardTitle,IonText, IonList, IonLabel, IonItem, IonCardHeader, IonCol, IonRow, IonCardContent,IonGrid,IonIcon, IonButton, IonInput, useIonPicker, IonBadge, useIonLoading, IonListHeader, useIonPopover, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import {getAllController, controllerUpdate, getLang, controller, addPlant, updateController} from '../../scripts/superStore';
import {trashBinOutline, saveOutline, optionsOutline, addOutline, copyOutline} from 'ionicons/icons';
import './DisplayController.css'
import DisplayPlantSettings from './PlantSettings';

var lang = getLang();
var controllers = getAllController();

interface ContainerProps {
    controller: controller;
}

function handleAddPlant(id: string){
    addPlant(id).finally(() => {
        window.location.href = "/settings"
    });
}

const SettingsPopover: React.FC<{onHide: () => void;controller: controller;}> = ({onHide, controller}) => (    
    <IonList>

        <IonItem button detail={false} onClick={() => handleAddPlant(controller._id)}>
            <IonIcon icon={addOutline}></IonIcon>
            {lang.settings.controller.popover.addPlant}
        </IonItem>
        
        <IonItem button detail={false} href= {"/danger/reload_api/"+controller._id}>
            <div className="popoverdanger">
                <IonIcon icon={trashBinOutline}></IonIcon>
                {lang.settings.controller.popover.reloadApiKey}
            </div>
        </IonItem>
        
        <IonItem button lines="none" detail={false} href= {"/danger/delete_controller/"+controller._id}>
            <div className="popoverdanger">
                <IonIcon icon={trashBinOutline}></IonIcon>
                {lang.settings.controller.popover.deleteController}
            </div>
        </IonItem>

    </IonList>
)


const DisplayController: React.FC<ContainerProps> = ({controller}) => {
    //element states
    const [loadingCircle] = useIonLoading();
    const [settingsShow, settingsUnshow] = useIonPopover(SettingsPopover, {onHide: () => settingsUnshow(), controller: controller});

    //settings editable by humans
    const [conName, setConName] = useState<string>(controller.name);
    const [cycleTime, setCycleTime] = useState<number>(controller.cycle_time/1000);
    
    console.log(controller);

    function getCycleTimePickerValues():{ text: number; value: number; }[]{
        var out = []
        for(var i = 1; i <= 100; i++){
            out.push({ text: i, value: i })
        }
        return out
    }

    function copyApiKey(){
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(controller.api_key);
                document.getElementById("apibadge" + controller._id)!.style.display = "block";
                setTimeout(() => {document.getElementById("apibadge" + controller._id)!.style.display = "none"}, 2000)
            }
        });
    }

    function handleSaveController(){
        console.log(cycleTime)
        if(conName != "" && cycleTime != undefined){
            loadingCircle();

            updateController(controller._id, {name: conName, cycle_time: cycleTime * 1000}).finally(() => {
                //window.location.href = "/settings"
            })
        }
    }

    return (
        <IonCard className="controllerCard">
            <IonCardHeader>
                
                <IonCardTitle style={{}}>
                    {conName != "" ? conName : "<NONE>"}
                    <IonIcon icon={optionsOutline} size="large" style={{float:"right",color:"white"}} onClick={(e) => settingsShow({event: e.nativeEvent})}></IonIcon>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    <form> 
                        {/*
                            Name
                        */}
                        <IonItem lines="inset">
                            <IonLabel position="floating">{lang.settings.controller.nameTitle}</IonLabel>
                            <IonInput value={conName} onIonChange={e => setConName(e.detail.value!)} required></IonInput>
                        </IonItem>
                        
                        {/*
                            API-Key
                        */}
                        <IonItem lines="inset">
                            <IonLabel position="floating">{lang.settings.controller.apiTitle}</IonLabel>
                            <IonTextarea value={controller.api_key} readonly></IonTextarea>
                            
                            <IonBadge color="success" id={"apibadge" + controller._id} style={{display:"none"}}>{lang.settings.controller.copySuccessText}</IonBadge>
                            
                            <IonButton onClick={copyApiKey}>
                                <IonIcon icon={copyOutline}></IonIcon>
                            </IonButton>
                        </IonItem>
                        
                        {/*
                            Cycle Time
                        */}
                        <IonItem lines="inset">
                            <IonLabel position="floating">{lang.settings.controller.cycleTime.title}</IonLabel>
                            <IonInput onIonChange={e => setCycleTime(Number(e.detail.value))} value={cycleTime} type="number" step="1" min="0" required></IonInput>
                        </IonItem>

                        <IonButton color="success" onClick={handleSaveController} type="submit">
                            <IonIcon icon={saveOutline}></IonIcon>{lang.settings.controller.saveText}
                        </IonButton>
                    </form>
                </IonList>
                <div className="plantGrid">
                    {controller.plants.map((data: any) => {
                        {return(<>
                            <IonItem lines="none" key={data.log._id} >
                                <DisplayPlantSettings plantData={data}></DisplayPlantSettings>
                            </IonItem>
                        </>)}
                    })}
                </div>
            </IonCardContent>
        </IonCard>
    );
  };

export default DisplayController;
