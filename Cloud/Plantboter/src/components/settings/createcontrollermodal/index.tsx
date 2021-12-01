import { IonButton, IonCard, IonCheckbox, IonContent, IonDatetime, IonInput, IonItem, IonLabel, IonRange, useIonViewDidEnter } from "@ionic/react";
import { useState } from "react";
import { SettingsModel } from "../../../model/settings.model";
import api from "../../../services/Api";
import timeService from '../../../services/time';
import Loading from "../../loading";
import './style.css';

const ControllerCreationModal: React.FC<{
    onDismiss: () => void;
}> = ({ onDismiss }) => {

    function createController() {
        var expire_date = no_expiration ? cycle_time : null;
        setCreateControllerLoading("loading");
        api.controller.createController({
                name: name,
                cycle_time: cycle_time
            })
            .then((response) => {
                var id = response.data.controller.id;
                api.api_key.createApiKey({
                    expires_at: expire_date,
                    controller_id: id 
                })
                .then((api_response) => {
                    setCreateControllerLoading("success");
                    window.location.href = "/settings/" + id;
                })
                .catch((error) => {
                    console.log(error);
                    setCreateControllerLoading("error");
                });
            })
            .catch((error) => {
                console.log(error);
                setCreateControllerLoading("error");
            });
    }
    
    const [name, setName] = useState<string>();
    const [cycle_time, setCycleTime] = useState<number>();
    const [expires_at, setExpiresAt] = useState<Date>();
    const [no_expiration, setNoExpiration] = useState<boolean>();
    const [create_api_key, setCreateApiKey] = useState<boolean>();
    const [settings, setSettings] = useState<SettingsModel>();

    const [create_controller_loading, setCreateControllerLoading] = useState("none");

    useIonViewDidEnter(() => {
        api.getSettings()
            .then((response) => {
                setSettings(response.data.settings);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <IonContent>
            <IonCard>
                <IonItem>
                    <IonLabel>Name:</IonLabel>
                    <IonInput onIonChange={e => setName(e.detail.value!)}></IonInput>
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

                <IonItem>
                    <IonLabel>Create a API-key at creation of controller</IonLabel>
                    <IonCheckbox checked={true}></IonCheckbox>
                </IonItem>

                <IonItem>
                    <IonLabel></IonLabel>
                    <IonCheckbox checked={true}></IonCheckbox>
                </IonItem>

                <IonItem>
                    <IonLabel></IonLabel>
                    <IonDatetime></IonDatetime>
                </IonItem>

            </IonCard>
            <IonItem className="bottombuttons">
                <IonButton onClick={() => createController()}>Create Controller<Loading slot="end" status={create_controller_loading}></Loading></IonButton>
                <IonButton onClick={() => onDismiss()}>Cancel</IonButton>
            </IonItem>
        </IonContent>
    );
};

export default ControllerCreationModal;