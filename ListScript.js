var array_of_objects = {};
var ElId = 1;
var ElUl= document.getElementById("main_list");
var Nwindow = document.getElementById("okno");
var WButton = document.getElementById("WButton");
var WFilter = document.getElementById("list_filter");
//True - Новый элемент False - Изменение старого элемента
var Element_Flag = true;
var model_window_Flag = false; // Открыто ли модальное окно или нет
var changable_index;
var changable_element;
// Два массива 1 - Показывает, какие уровни importance были введены пользователеи
              //2 - Показывает, какие уровни importance на данный момент отображены на странице
var All_Importance = {"Plan" : 0,
                      "Done" : 0,
                      "Manage" : 0,
                      "Delete" : 0}

var Display_Items = {"Plan" : false,
                      "Done" : false,
                      "Manage" : false,
                      "Delete":false}





// $(document).keyup(function(e){
//     if (e.keyCode == )
// })

function openW()
  {
      Nwindow.className = "openOkno";   
      callWindow.className = "closeOkno";
      ElUl.className = "closeOkno";
      WFilter.className = "closeOkno";
      model_window_Flag = true;
}
function closeW()
  {
      Nwindow.className = "closeOkno";
      callWindow.className = "openOkno";
      ElUl.className = "openOkno";
      WFilter.className = "openOkno";
      model_window_Flag = false;
}
  
  // Получение даты 
function GetDate()
  {
    
    let date = new Date();
    let week = '';
    let hours = '';
    week = ((Number(date.getDate())<10) ? '0'+date.getDate() : date.getDate())+"/";
    week +=((Number(date.getMonth())<10) ? '0'+date.getMonth() : date.getMonth()) +"/";
    week +=date.getFullYear();
    hours = String((Number(date.getHours())<10) ? '0'+date.getHours() : date.getHours());
    hours += ":" + String((Number(date.getMinutes())<10) ? '0'+date.getMinutes() : date.getMinutes());
    hours +=":" + String((Number(date.getSeconds())<10) ? '0'+date.getSeconds() : date.getSeconds());
    return(week + ' ' + hours);
}
  
function DivDis(NameEl, week, importance)
  {
    //Стилизация div
    let mainDiv = document.createElement("div");
    mainDiv.className = "mainDiv";
    
    let impDiv = document.createElement("div");
    impDiv.appendChild(document.createTextNode(importance));

        
    let textDiv = document.createElement("div");
    textDiv.appendChild(document.createTextNode(NameEl));

    let hoursDiv = document.createElement("div");
    hoursDiv.appendChild(document.createTextNode(week));

    let buttonDiv = document.createElement("div");

    //Добавление события - Изменить элемент
    let BChange = document.createElement('button');
    BChange.setAttribute('class','LiButChange');
    $(BChange).on('click',function(){
        All_Importance[(array_of_objects[$(this).parent().parent().attr("id")]["Importance"])] -= 1;
        if (!All_Importance[(array_of_objects[$(this).parent().parent().attr("id")]["Importance"])])
        {
            Display_Items[(array_of_objects[$(this).parent().parent().attr("id")]["Importance"])] = false;
        }
        changable_element = $(this).parent().parent();
        changable_index = changable_element.attr("id");
        Element_Flag = false;
        openW();
    });

    //Добавление события - Удалить элемент
    let BDelete = document.createElement("button");
    BDelete.setAttribute('class','LiButDelete');
    $(BDelete).on('click', function() {
        All_Importance[(array_of_objects[$(this).parent().parent().attr("id")]["Importance"])] -= 1;
        if (!All_Importance[(array_of_objects[$(this).parent().parent().attr("id")]["Importance"])])
        {
            Display_Items[(array_of_objects[$(this).parent().parent().attr("id")]["Importance"])] = false;
        }
        delete(array_of_objects[$(this).parent().parent().attr("id")]);
        $(this).parent().parent().remove();
       
    });

    buttonDiv.appendChild(BChange);
    buttonDiv.appendChild(BDelete);
    mainDiv.appendChild(impDiv);
    mainDiv.appendChild(textDiv);
    mainDiv.appendChild(hoursDiv);
    mainDiv.appendChild(buttonDiv);
    $(mainDiv).addClass(importance);
    Display_Items[importance] = true;
    return (mainDiv);
}
  
  
function NewEl()
  {
    //Получение значение текстового поля и дату создания элемента
    let NameEl = document.getElementById("newEl").value;
    let week = GetDate();

    //Получение степени важности
    let importance;
        importance = document.querySelector('input[name="Form"]:checked').value;    
    if (!importance)
    {
        alert("")
    }
    All_Importance[importance] ++;
    Display_Items[importance] = true;
    
    /* Создание нового объекта с добавлением его в массив*/
    let newObj = 
    {
        "Text":NameEl,
        "Week":week,
        "Importance":importance
    }
   
    // Оформление div для вставки
    let mainDiv = DivDis(NameEl, week, importance);
    
    if (Element_Flag)
    {
       
        array_of_objects[ElId] = newObj;   
        mainDiv.id = ElId;
        ElId++;
        ElUl.appendChild(mainDiv)
    }
    else
    {
        array_of_objects[changable_index] = newObj;
        mainDiv.id = changable_index;
        changable_element.replaceWith(mainDiv);
        Element_Flag = true;
    }

    // Очистка поля ввода
    document.getElementById("newEl").value = "";
    
    //Закрываем модальное окно
    closeW();
      
}
function Filtr_Items(){
    
    //Получение выбранных фильтров
    let chosen_filtr = [];
        $('input:checkbox:checked').each(function(){
            chosen_filtr.push(this.value);
        });
        
    // Поверка состоит из двух этапов: 
    // 1- Отображенные с неподходящим значением importance строки подлежат удалению со страницы
    // 2- Добавление необходимых строк, которые на данный момент еще не отображены 

    for (let i in Display_Items)
    {
        let flag_F = false;   
        chosen_filtr.forEach((element) =>
        {
            if (i == element) 
            {
                flag_F = true;
            }
        });
        
        //1- Удаление
        if (!(flag_F) && (Display_Items[i]))
        {
            Display_Items[i] = false;
            ($("."+String(i))).remove()
        }
        
        // 2 - Добавление
        if ((flag_F) && !(Display_Items[i]) && (All_Importance[i]>0)){
            for(let j = 1; j <= Object.keys(array_of_objects).length; j++)
            {
                if (i == array_of_objects[j]["Importance"] )
                    {
                        let mainDiv= DivDis(array_of_objects[j]["Text"], array_of_objects[j]["Week"], array_of_objects[j]["Importance"]);
                        mainDiv.id = j;
                        ElUl.appendChild(mainDiv);
                    }             
            }
        }
    }
}  