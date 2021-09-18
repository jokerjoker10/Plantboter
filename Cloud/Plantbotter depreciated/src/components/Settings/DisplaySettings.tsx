import React, { useEffect, useState } from 'react';
import { IonCard, IonCardTitle, IonCol, IonLabel, IonItem, IonCardHeader, useIonViewDidEnter, IonRow, IonCardContent,IonGrid,IonIcon, IonButton, IonInput, useIonLoading } from '@ionic/react';
import {getAllController, getLog, getLang, controller, plant, addController} from '../../scripts/superStore';
import {addOutline, hardwareChipOutline, leafOutline, imageOutline, closeCircleOutline, saveOutline} from 'ionicons/icons';
import './DisplayController.css'
import {getLastContact, getLogRedirect, loadImg, getLastSensorValue, getAllPlants} from '../../scripts/utils'

import DisplayPlantSettings from './PlantSettings';
import DisplayController from './DisplayController'
import { timeout } from 'workbox-core/_private';

var lang = getLang();

interface ContainerProps {
    controller: Promise<Array<controller>>;
}

const DisplaySettings: React.FC<ContainerProps> = ({controller}) => {
    const [controllers, setControllers] = React.useState<Array<controller>>([]);
    
    const [loadingCircle] = useIonLoading();
    
    React.useEffect(() => {
        controller
        .then(data => setControllers(data))
    }, []);


    function handleAddController(){
        loadingCircle();
        addController().finally(() => {
            window.location.href = "/settings"
        })
    }

    return (
        <div className="SettingGrid">
            {
                controllers.map((controller, index) => (
                    <DisplayController key={index} controller={controller}></DisplayController>
                ))
            }
            <IonCard className="addControllerCard">
                <IonCardHeader>
                    <IonCardTitle>{lang.settings.addControllerTitle}</IonCardTitle>
                    <div style={{fontSize:100,color:"black",marginTop:20,textAlign:"center"}}>
                        <IonIcon icon={hardwareChipOutline}></IonIcon>
                    </div>
                </IonCardHeader>
                <IonCardContent className="addControllerCardBody" >
                    <IonButton color="success" onClick={handleAddController}>
                        <IonIcon className="addButton" icon={addOutline}></IonIcon>
                    </IonButton>
                </IonCardContent>
            </IonCard>
      </div>
    );
  };

export default DisplaySettings;