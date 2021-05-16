import React, { useState } from 'react';
import { IonCard, IonCardTitle,IonText, IonRange, IonLabel, IonItem, IonCardHeader, IonCol, IonRow, IonCardContent,IonGrid,IonIcon, IonButton, IonInput, IonContent, IonBadge, useIonLoading } from '@ionic/react';
import {getAllController, controllerUpdate, getLang, controller, addPlant, updateController} from '../../scripts/superStore';
import {addOutline, reloadOutline, hardwareChipOutline, trashBinOutline, leafOutline, imageOutline, closeCircleOutline, saveOutline} from 'ionicons/icons';
import './DisplayController.css'

import DisplayPlantSettings from './PlantSettings';
import { isWhiteSpaceLike } from 'typescript';

var lang = getLang();
var controllers = getAllController();

interface ContainerProps {
    controller: controller;
}


const DisplayController: React.FC<ContainerProps> = ({controller}) => {
    const [loadingCircle] = useIonLoading();
    const [conName, setConName] = useState<string>(controller.name);

    function copyApiKey(){
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(controller.api_key);
                document.getElementById("apibadge" + controller._id)!.style.display = "block";
                setTimeout(() => {document.getElementById("apibadge" + controller._id)!.style.display = "none"}, 2000)
            }
        });
    }

    function handleAddPlant(id: string){
        loadingCircle();
        addPlant(id).finally(() => {
            window.location.href = "/settings"
        });        
    }

    function handleSaveController(){
        loadingCircle();

        updateController(controller._id, {name: conName}).finally(() => {
            window.location.href = "/settings"
        })
    }

    return (
        <IonCard className="controllerCard">
            <IonCardHeader>
                <IonCardTitle>{conName}</IonCardTitle>
                <div style={{fontSize:100,color:"black",marginTop:20,textAlign:"center"}}>
                    <IonIcon icon={hardwareChipOutline}></IonIcon>
                </div>
            </IonCardHeader>
            <IonCardContent>
                <IonItem>
                    <IonGrid>

                        <IonRow>
                            <IonCol>{lang.settings.controller.nameTitle}</IonCol>
                            <IonCol>
                                <IonInput value={conName} onIonChange={e => setConName(e.detail.value!)}></IonInput>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol>
                                {lang.settings.controller.apiTitle}
                                <IonBadge color="success" id={"apibadge" + controller._id} style={{display:"none"}}>{lang.settings.controller.copySuccessText}</IonBadge>
                            </IonCol>
                            <IonCol style={{lineBreak:"auto",width:"150px"}}>
                                <IonText onClick={copyApiKey} id="apikey">
                                    <span title={lang.settings.controller.copyHoverText}>
                                        {controller.api_key}
                                    </span>
                                </IonText>
                            </IonCol>
                        </IonRow>

                        <IonButton color="success" onClick={handleSaveController}>
                            {lang.settings.controller.saveText}<IonIcon icon={saveOutline}></IonIcon>
                        </IonButton>

                        <IonRow className="dangerzone">
                            <IonCol>{lang.settings.controller.danger.title}</IonCol>
                            <IonCol>
                                <IonButton color="danger" href={"/danger/delete_controller/" + controller._id}>
                                    <IonIcon icon={trashBinOutline}></IonIcon>
                                    {lang.settings.controller.danger.deleteController}
                                </IonButton>
                                <IonButton color="danger" href={"/danger/reload_api/" + controller._id}>
                                    <IonIcon icon={reloadOutline}></IonIcon>
                                    {lang.settings.controller.danger.reloadApiKey}
                                </IonButton>
                            </IonCol>
                        </IonRow>
                        
                    </IonGrid>
                </IonItem>
                <div className="plantGrid">
                    {controller.plants.map((data: any) => {
                        {return(<>
                            <DisplayPlantSettings plantData={data}></DisplayPlantSettings>
                        </>)}
                    })}
                    <IonCard className="addControllerCard">
                        <IonCardHeader>
                            <IonCardTitle><IonIcon icon={leafOutline}></IonIcon> {lang.settings.controller.plants.addPlantTitle}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent className="addControllerCardBody" >
                            <IonButton color="success" onClick={(e) => handleAddPlant(controller._id)}>
                                <IonIcon className="addButton" icon={addOutline}></IonIcon>
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonCardContent>
        </IonCard>
    );
  };

export default DisplayController;
