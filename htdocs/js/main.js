$(function() {
    const $window = $(window);
    const $name = $(".title");
    const $content = $(".content");
    const $right_btn = $("#right_btn");
    const $left_btn = $("#left_btn");
    const $bottom_btn = $("#bottom_btn");
    const $contents = [$("#top"), $("#profile"), $("#works")];
    const $titles = [$("#top-title"), $("#profile-title"), $("#works-title")];
    const $main_contents = [$("#top-main"), $("#profile-main"), $("#works-main")];

    const Clock = new THREE.Clock();

    var currentScene = 0;
    var currentTime = 2;
    var sceneChengeDuration = 2;

    var lateScene = 0;

    var isOpenContent = false;

    var width = window.innerWidth;
    var height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#canvas")
    });

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height);
    const parentCam = new THREE.Group();

    const geometry = new THREE.BoxGeometry(500, 500, 500);
    const material = new THREE.MeshNormalMaterial();
    const boxes = blocks();

    var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';


    function init() {
        onResize();

        scene.add(parentCam);
        parentCam.position.set(0, 0, +1000);
        parentCam.add(camera);
        camera.position.set(0,0,0);
        //scene.add(boxes[0]);


        boxes.forEach(function(item, index, array){
          scene.add(item);
          item.position.x += index * 80 * getRandomInt(10) - (array.length * 40);
          item.position.y += index * 40 * getRandomInt(10) - (array.length * 20);
        });

        SetScene(currentScene);

        tick();
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function blocks() {
        var boxes = [];
        for (var i = 0; i < 10; i++) {
            boxes.push(new THREE.Mesh(geometry, material));
        }
        return boxes;
    }

    function tick() {
        boxes.forEach(function(item, index, array) {
            //item.rotation.y += 0.01;
        });

        renderer.render(scene, camera);

        currentTime += Clock.getDelta();

        cameraUpdate();

        requestAnimationFrame(tick);
    }

    function cameraUpdate() {
        if (currentTime <= sceneChengeDuration) {
            var lerp = Math.lerp(-90 * lateScene, -90 * currentScene, currentTime/sceneChengeDuration);
            var cameraPos = CameraRotatePos(lerp, 1000);

            //console.log("" + cameraPos.x + ", " + cameraPos.y);
            parentCam.position.x = cameraPos.x;
            parentCam.position.z = cameraPos.y;
            parentCam.rotation.y = Math.atan2(cameraPos.y, -cameraPos.x) + (Math.degToRad(-90));
            //console.log(parentCam.rotation.y);
        }
        else {
            lateScene = currentScene;
        }
    }

    function onResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        // console.log("" + window.innerWidth +", "+ window.innerHeight);

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function CameraRotatePos(degree, radius) {
        degree %= 360;
        var rad = Math.degToRad(degree);
        var pos = {
            'x': 0,
            'y': 0
        };
        pos.x = (radius * Math.cos(rad) - Math.sin(rad));
        pos.y = (radius * Math.sin(rad) + Math.cos(rad));

        return pos;
    }

    function InitScene(scene){
        isOpenContent = false;
        $main_contents[scene]
            .addClass("bottom-content")
            .removeClass("center-content");
        $titles[scene]
            .addClass("center-content")
            .removeClass("bottom-content");
    }

    function SetScene(scene){
        HideAllScene();
        /*
        var campos = CameraRotatePos(90, camera.position.x, camera.position.z);
        console.log(campos);
        */
        switch (currentScene) {
            case 0:
                ActiveTopScene();
                break;
            case 1:
                ActiveProfileScene();
                break;
            case 2:
                ActiveWorksScene();
                break;
        }
    }

    function HideAllScene()
    {
        $bottom_btn.hide();
        $content.removeClass("center-content");
        $content.removeClass("right-content");
        $content.removeClass("left-content");
    }
    // TopSceneに切り替える
    function ActiveTopScene() {
        $bottom_btn.hide();
        $right_btn.show();
        $left_btn.hide();
        $contents[0].addClass("center-content");
        $contents[1].addClass("right-content");
        $contents[2].addClass("right-content");
    }

    // ProfileSceneに切り替える
    function ActiveProfileScene() {
        $bottom_btn.show();
        $right_btn.show();
        $left_btn.show();
        $contents[0].addClass("left-content");
        $contents[1].addClass("center-content");
        $contents[2].addClass("right-content");
    }

    // WorksSceneに切り替える
    function ActiveWorksScene() {
        $bottom_btn.show();
        $right_btn.hide();
        $left_btn.show();
        $contents[0].addClass("left-content");
        $contents[1].addClass("left-content");
        $contents[2].addClass("center-content");
    }

    function OnRightBtn(){
        if(currentTime > 2){
            currentTime = 0;
            InitScene(currentScene);
            currentScene++;
            currentScene %= 3;
            SetScene(currentScene);
        }
    }

    function OnLeftBtn(){
        if(currentTime > 2){
            currentTime = 0;
            InitScene(currentScene);
            currentScene--;
            currentScene = currentScene < 0 ? 2 : currentScene;
            currentScene %= 3;
            SetScene(currentScene);
        }
    }

    function OnDownBtn(){
        if(isOpenContent)
            return;
        if(currentTime > 2){
            isOpenContent = true;
            currentTime = 0;
            $main_contents[currentScene]
                .addClass("center-content");
            $titles[currentScene]
                .removeClass("center-content")
                .addClass("top-content");
        }
    }

    function OnUpBtn(){
        if(!isOpenContent)
            return;
        if(currentTime > 2){
            isOpenContent = false;
            currentTime = 0;
            $main_contents[currentScene]
                .removeClass("center-content")
                .addClass("top-content");
            $titles[currentScene]
                .addClass("center-content");
        }
    }

    // 度をラジアンに変換
    Math.degToRad = function(degree) {
        return degree * (Math.PI / 180);
    }

    Math.radToDeg = function(radian) {
        return radian * (180 / Math.PI);
    }

    Math.lerp = function(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    init();

    $window.on('resize', function() {
        onResize();
    });

    $window.on("mousemove", function(e) {
        const mouseX = e.pageX / width - 0.5;
        const mouseY = e.pageY / height - 0.5;
        $name.css("top", -mouseY * 100);
        $name.css("left", -mouseX * 100);

        camera.position.x = -mouseX * 100;
        camera.position.y = mouseY * 100;

        //console.log(""+ mouseX / width + ", " + mouseY / height);
    });

    $window.on(mousewheelevent,function(e){
        e.preventDefault();
        var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
        if (delta < 0){
            // マウスホイールを下にスクロールしたときの処理を記載
            console.log("down");
            OnDownBtn();
        } else {
            // マウスホイールを上にスクロールしたときの処理を記載
            console.log("up");
            OnUpBtn();
        }
    });

    $right_btn.on("click", function() {
        OnRightBtn();
        //console.log(""+ currentScene + ", "+ ((currentScene+2) % 3));
    });

    $left_btn.on("click", function(){
        OnLeftBtn();
    });

    $bottom_btn.on("click", function() {
        OnDownBtn();
    });
});
