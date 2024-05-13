import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { FREQUENCY_SECONDS } from './Constants';

const BACKGROUND_FETCH_TASK = 'background-fetch';


export async function FetchDataBackground(callback = null) {
  try {
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
      try {
        !!callback && await callback()
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (error) {
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });
    
    async function registerBackgroundFetchAsync() {
      return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: FREQUENCY_SECONDS,
        stopOnTerminate: false, 
        startOnBoot: true,
      });
    }
    
    async function unregisterBackgroundFetchAsync() {
      return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }
    
    const checkStatusAsync = async () => {
      const status = await BackgroundFetch.getStatusAsync();
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
      return ({status,isRegistered});
    };

  const {status,isRegistered} = await checkStatusAsync();
  (!isRegistered) && await registerBackgroundFetchAsync();
  } catch (error) {
    console.log('error',error);
  }
}