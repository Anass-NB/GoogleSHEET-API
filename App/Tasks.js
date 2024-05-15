
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch';
let _callback=null;

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async (...params) => {
  try {
    
  console.log('in defineTask',params,"!!_callback",!!_callback);
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  if(!!_callback) _callback();
  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
  return BackgroundFetch.BackgroundFetchResult.Failed;
    
  }
});

async function registerBackgroundFetchAsync() {
  console.log('in registerBackgroundFetchAsync');
  const result = BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 10 , 
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
  console.log(await result);
  return result;
}

async function unregisterBackgroundFetchAsync() {
  console.log('in unregisterBackgroundFetchAsync');
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

const checkStatusAsync = async () => {
  console.log('in checkStatusAsync');
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  return ({status,isRegistered})
};

const toggleFetchTask = async () => {
  if ((await checkStatusAsync())?.isRegistered) {
    await unregisterBackgroundFetchAsync();
  } else {
    await registerBackgroundFetchAsync();
  }
};

export async function fetchBackground(callback = null) {
  _callback=callback;
  console.log('in fetchBackground');
  await toggleFetchTask();
  await registerBackgroundFetchAsync();
  const {status,isRegistered} = await checkStatusAsync();
  console.log("status",status,"isRegistered",isRegistered);
}
