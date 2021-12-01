import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonContent, IonDatetime, IonInput, IonItem, IonLabel, IonRange, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { ApiModel } from "../../../model/api.model";
import { SettingsModel } from "../../../model/settings.model";
import api from "../../../services/Api";
import timeService from '../../../services/time';
import Loading from "../../loading";
import './style.css';

const ApiModal: React.FC<{
    controller_id: Number,
    onDismiss: () => void;
}> = ({ onDismiss, controller_id }) => {
    const [settings, setSettings] = useState<SettingsModel>();
    const [api_data, setApiData] = useState<Array<ApiModel>>();

    const [show_create_new, setShowCreateNew] = useState<boolean>();
    const [new_controller_expires, setNewControllerExpires] = useState<boolean>(true);
    var date = new Date();
    const [key_expires_at, setKeyExpiresAt] = useState<Date>(new Date(date.setMonth(date.getMonth()+1)));
    var key_max_expires = new Date();
    key_max_expires.setFullYear(key_max_expires.getFullYear() + 1, key_max_expires.getMonth(), key_max_expires.getDay())

    const [create_controller_loading, setCreateControllerLoading] = useState("none");

    function createNewApiKey() {
        console.log(new_controller_expires)
        console.log(key_expires_at)

        if (new_controller_expires && !key_expires_at) {

            return;
        }

        setCreateControllerLoading("loading");
        var expiration_date = new_controller_expires ? key_expires_at : null;
        api.api_key.createApiKey({
            expires_at: expiration_date,
            controller_id: controller_id
        })
            .then((response) => {
                setCreateControllerLoading("success");
                getApiData();
            })
            .catch((error) => {
                setCreateControllerLoading("error");
                console.log(error);
            });
    }

    const [current_api_key, setCurrentApiKey] = useState<ApiModel>();
    const [api_key_history, setApiKeyHistory] = useState<Array<ApiModel>>();

    function getApiData() {
        api.api_key.getApiKey(controller_id)
            .then((response) => {
                setApiData(response.data.api_key);

                setCurrentApiKey(response.data.api_key[response.data.api_key?.length - 1]);
                response.data.api_key.forEach((element: ApiModel) => {
                    if (element.id != response.data.api_key[response.data.api_key?.length - 1].id) {
                        setApiKeyHistory([...api_key_history!, element])
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useIonViewDidEnter(() => {
        getApiData();
        api.getSettings()
            .then((response) => {
                setSettings(response.data.settings);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const [data_collected, setDataCollected] = useState<boolean>(false);
    if (!data_collected) {
        setDataCollected(true);
        getApiData();
    }

    return (
        <IonContent>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>Api Key</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                    <p>UID: <b>{current_api_key?.id}</b></p>
                    <p>Status: <b>{current_api_key?.status}</b></p>
                    <p>Expires At: <b>{current_api_key?.expire_at == null ? "Does not Expire" :timeService.dateToString(current_api_key?.expire_at!)}</b></p>
                    <p>Created At: <b>{timeService.dateToString(current_api_key?.createdAt!)}</b></p>
                    <p>Updated At: <b>{timeService.dateToString(current_api_key?.updatedAt!)}</b></p>
                    <p>Key:
                        <IonCard color="medium">
                            <IonCardContent>
                                <p>{current_api_key?.key}</p>
                            </IonCardContent>
                        </IonCard>
                    </p>
                </IonCardContent>

                <IonCardContent>
                    <details>
                        <summary>All Api Keys</summary>
                        <p>
                            {api_data?.map((element: ApiModel) => {
                                if (element.id != api_data[api_data.length - 1].id) {
                                    return (
                                        <>

                                            <p key={Number(element.id)}>
                                                <IonCard color="light">
                                                    <IonCardContent>
                                                        <p>UID: <b>{element.id}</b></p>
                                                        <p>Status: <b>{element.status}</b></p>
                                                        <p>Expires At: <b>{element.expire_at == null ? "Does not Expire" :timeService.dateToString(element.expire_at!)}</b></p>
                                                        <p>Created At: <b>{timeService.dateToString(element?.createdAt)}</b></p>
                                                        <p>Updated At: <b>{timeService.dateToString(element?.updatedAt)}</b></p>
                                                        <p>Key:
                                                            <IonCard color="medium">
                                                                <IonCardContent>
                                                                    <p>{element.key}</p>
                                                                </IonCardContent>
                                                            </IonCard>
                                                        </p>
                                                    </IonCardContent>
                                                </IonCard>
                                            </p>
                                        </>
                                    )
                                }
                            })}
                        </p>
                    </details>
                </IonCardContent>

                <IonCardContent>
                    <p>
                        Api Keys can't be updated but you can create a new one. The old will be set to "Inactive" and this controller needs to be updated with the new Api Key.
                    </p>
                    <IonButton color="danger" size="small" onClick={() => setShowCreateNew(show_create_new ? false : true)}>Create New Api Key</IonButton>
                </IonCardContent>

                <IonCardContent style={{ display: (show_create_new == true ? "block" : "none") }}>
                    <IonItem>
                        <IonLabel>Api Key Expires:</IonLabel>
                        <IonCheckbox checked={new_controller_expires} onIonChange={e => setNewControllerExpires(e.detail.checked)}></IonCheckbox>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Expire Date:</IonLabel>
                        <IonDatetime disabled={!new_controller_expires} ref={e => setKeyExpiresAt(new Date(e?.value!))} value={key_expires_at.toString()} max={new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDay()).toString()}></IonDatetime>
                    </IonItem>
                    <p>Warning! After Creating a new Api Key you have to Reprogram the Controller of this Key.</p>
                    <IonButton size="small" onClick={() => createNewApiKey()}>Create Api Key</IonButton>
                </IonCardContent>
 
            </IonCard>

            <IonItem className="bottombuttons">
                <IonButton onClick={() => onDismiss()} size="default">Back</IonButton>
            </IonItem>
        </IonContent>
    );
};

export default ApiModal;