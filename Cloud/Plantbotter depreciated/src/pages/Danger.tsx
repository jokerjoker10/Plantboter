import { IonContent,IonItem,IonCard,IonCardContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonFab, IonFabButton, IonButtons, IonBackButton, IonCardHeader, IonCardTitle, IonCardSubtitle, IonInput, IonButton, IonCheckbox, useIonLoading} from '@ionic/react';
import DisplaySettings from '../components/Settings/DisplaySettings';
import {settingsOutline} from 'ionicons/icons';
import { controller, reloadApiKey, getAllController, getLang, removePlant, removeController} from '../scripts/superStore';
import { RouteComponentProps } from 'react-router';
import './Danger.css';
import React, { useEffect, useState } from 'react';

interface DangerParam extends RouteComponentProps<{
  id: string;
  type: string;
}> {}

var lang = getLang();

const Danger: React.FC<DangerParam> = ({match}) => {
  const type = match.params.type;
  const id = match.params.id;
  
  const [loadingCricle] = useIonLoading();
  
  var title = "";
  var text = "";

  function handleAproove(id: string, type: string){
    if(type == "reload_api"){
      loadingCricle();
      reloadApiKey(id).finally(() => {
        window.location.href = "/settings";
      });
    }
    else if(type == "delete_controller"){
      loadingCricle();
      removeController(id).finally(() =>{
        window.location.href = "/settings";
      });
    }
    else if(type == "delete_plant"){
      loadingCricle();
      removePlant(id).finally(() =>{
        window.location.href = "/settings";
      });
    }
    else{
      window.location.href = "/settings";
    }
  }

  function loadInterface(){
    if(type == "reload_api"){      
      title = lang.danger.reload_api.cardTitle;
      text = lang.danger.reload_api.warning;
    }
    else if(type == "delete_controller"){
      title = lang.danger.delete_controller.cardTitle;
      text = lang.danger.delete_controller.warning;
    }
    else if(type == "delete_plant"){
      title = lang.danger.delete_plant.cardTitle;
      text = lang.danger.delete_plant.warning;
    }
    else{
      window.location.href = "/settings";
    }
  }
  
  loadInterface();

  return (
    <IonPage className="Danger Zone">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Danger Zone</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader className="red">
            <IonCardTitle>{title}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              {text} 
            </IonItem>
            <IonCardContent>
              <IonButton color="danger" onClick={e => handleAproove(id, type)}>
                {lang.danger.aprooveButtonText}
              </IonButton>
            </IonCardContent>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Danger;
