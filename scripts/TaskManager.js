const TaskManager = (function() {
    let self = this;
    let TaskContainer;
    let taskElCollection = [];
    
    const newTaskId = function() {
        return (new Date()).getTime();
    }

    const backCounter = function() {
        return '';
    }


    const getRemainTime = deadline => {
        let now = new Date(),
            remainTime = (new Date(deadline) - now + 1000) /1000,
            remainSeconds = ('0' + Math.floor(remainTime % 60)).slice(-2),
            remainMinutes = ('0' + Math.floor(remainTime / 60 % 60)).slice(-2),
            remainHours = ('0' + Math.floor(remainTime / 3660 % 24)).slice(-2),
            remainDays = Math.floor(remainTime / (3600 * 24));
    
        return {
            remainTime,
            remainMinutes,
            remainSeconds,
            remainMinutes,
            remainHours,
            remainDays
        }
    };

    
    //const setCountDown = (deadline, elem, finalMessage) => {
    const setCountDown = () => {
        //let el = document.querySelector(elem);
    
        const timerUpdate = setInterval( () => {
            taskElCollection.forEach(task => {
                let t = getRemainTime(task.date);
                let elem = document.querySelector(`#task-${task.id} div.remaining-time`);

                if (t.remainTime > 1) {
                    elem.innerHTML =  `Time Remaining:  ${t.remainDays}d : ${t.remainHours} h: ${t.remainMinutes}m: ${t.remainSeconds}s`;
                } else {
                    elem.innerHTML = `Task expired.`;
                    taskElCollection = taskElCollection.filter( el => el[0] !== task.id );
                    window.localStorage.setItem(task.id, JSON.stringify({id:task.id, date:task.date, title:task.title, description:task.description, color:task.color, status:'Task expired'}));
                }
            });
            
        }, 1000);

        //console.log(timerUpdate);
    };


    const showTask = function(task) {
        const taskData = JSON.parse(task);
        //const newCountDown = new setCountDown;

        TaskContainer.innerHTML += 
            `<div id="task-${taskData.id}" class="task-card ${taskData.color}">
                <div class="card-details">
                    <div>${taskData.title}</div>
                    <div>${taskData.description}</div>
                    <div class="remaining-time"> ${taskData.status}. </div>
                </div>        
                <div class="card-actions">
                    <img src='./img/complete_icon_white.png' onclick='TaskManager.completeTask(${taskData.id})'>
                    <img src='./img/trash_icon_white.png' onclick='TaskManager.removeTask(${taskData.id})'>
                </div>
            </div>`;
        if(taskData.status == 'In progress')
            taskElCollection.push(taskData);
    }

    self.newTask = function(taskTitle, taskDescription, taskDate, color) {
        let date = (new Date()).getTime();
        let taskId = newTaskId();
        let timeRemaining = (taskDate-date);
        let task;

        if(!taskTitle)
            return 'Task title is needeed';
        
        if(!taskDate || (taskDate.getTime() < date))
            return 'Date is incorrect';

        taskDescription = typeof(taskDescription) !== 'string' ? '' : taskDescription;
        
        task = JSON.stringify({id:taskId, date:taskDate, title:taskTitle, description:taskDescription, color:color, status:'In progress'});
        window.localStorage.setItem(taskId, task);

        showTask(task);

        setCountDown();

        return 'Task was correctly added.'
    }

    self.removeTask = function(id) {
        let element = document.getElementById(`task-${id}`);
        let parent = element.parentElement;

        parent.removeChild(element);
        taskElCollection = taskElCollection.filter( el => el.id !== id );
        window.localStorage.removeItem(id);
    }

    self.completeTask = function(id) {
        const element = document.querySelector(`#task-${id} div.remaining-time`);
        const localStorage = window.localStorage;

        let task = JSON.parse(localStorage.getItem(id));
        
        taskElCollection = taskElCollection.filter( el => el.id !== id );
        element.innerHTML = `Task completed`;
        localStorage.setItem(task.id, JSON.stringify({id:task.id, date:task.date, title:task.title, description:task.description, color:task.color, status:'Task completed'}));
    }
    
    self.setContainer = function(taskContainer) {
        TaskContainer = taskContainer;
    }

    self.loadTasks = function() {
        let localStorage = window.localStorage;

        for (let key in localStorage) {
            let task = localStorage[key];
            
            console.log(typeof(task));

            if(!isNaN(key))
                showTask(task);
        }

        setCountDown();
    }
    
    return self;
})();