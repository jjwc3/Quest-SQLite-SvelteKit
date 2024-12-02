<header>
    <h1 class="text-2xl font-bold text-center">
        Coding Lab
    </h1>
</header>

<script lang="ts">
    import {onMount} from "svelte";
    import io from 'socket.io-client';

    interface Score {
        id: number;
        username: string;
        contact: string;
        score: number;
        xten: number;
    }

    let scores: Score[] = [];
    let username: string = "";
    let contact: string = "";
    let score: number | string = 0;
    let xten: number | string = 0;
    let tempScore: number | string = 0;
    let tempXten: number | string = 0;

    let socket: any;

    const connectWebsocket = () => {
        // Socket.IO 서버에 연결
        socket = io('http://localhost:8087');

        // 연결 성공 시
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        // 메시지 수신
        socket.on('chat message', (msg: any) => {
            const data = JSON.parse(msg);
            tempScore = data.score;
            tempXten = data.xten;
        });

        // 연결 해제 시
        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        return () => {
            // 컴포넌트가 파괴될 때 소켓 연결 해제
            socket.disconnect();
        };
    }

    async function getScore() {
        const response = await fetch('/api/scores');
        scores = await response.json();
    }

    async function mountFunction() {
        await getScore();
        connectWebsocket();
    }

    onMount(mountFunction);

    async function setScore() {
        let isError: boolean = false;
        if (!username.trim() || !contact.trim() || score === "" || xten === "") {
            (document.getElementById("error") as HTMLElement).style.display = "block";
            setTimeout(() => {
                (document.getElementById("error") as HTMLElement).style.display = "none";
            }, 3000);
            isError = true;
        }

        if (isError) return;

        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, contact, score, xten}),
        });
        if (response.ok) {
            username = "";
            contact = "";
            score = 0;
            xten = 0;
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    }

    // X-Ten 클릭 시 전체 선택
    function selectInput(event: FocusEvent) {
        const xtenInput = event.target as HTMLInputElement;
        xtenInput.select();
    }

    function both() {
        setScore();
        getScore();
    }

    function tempImport() {
        score = tempScore;
        xten = tempXten;
    }
</script>

<div class="flex flex-col lg:flex-row lg:justify-between">
    <form class="lg:basis-1/2">
        <div class="border border-slate-100 shadow-xl hover:shadow-2xl ease-in-out duration-500 rounded-md bg-white px-3 py-4 m-4 bg-opacity-70 hover:bg-opacity-100 transition-all">
            <h2 class="font-semibold text-xl text-center pb-1 mb-3 border-b border-slate-300 border-dashed">점수 등록</h2>
            <div class="mb-4 last:mb-0">
                <h3 class="flex items-center justify-center mb-1">
                    <p class="text-sm font-semibold">이름</p>
<!--                    <div class="text-slate-400 ml-2 text-xs"> </div>-->
                </h3>

                <label for="username"></label><input class="config border rounded-sm p-2 w-full h-12 text-xl" name="username" id="username" bind:value={username}>
            </div>
            <div class="mb-4 last:mb-0">
                <h3 class="flex items-center justify-center mb-1">
                    <p class="text-sm font-semibold">연락처</p>
                    <!--                    <div class="text-slate-400 ml-2 text-xs"> </div>-->
                </h3>

                <label for="contact"></label><input class="config border rounded-sm p-2 w-full h-12 text-xl" name="contact" id="contact" bind:value={contact}>
            </div>
            <div class="mb-4 last:mb-0">
                <h3 class="flex items-center justify-center mb-1">
                    <p class="text-sm font-semibold">점수</p>
                    <!--                    <div class="text-slate-400 ml-2 text-xs"> </div>-->
                </h3>

                <label for="score"></label><input class="config border rounded-sm p-2 w-full h-12 text-xl" name="score" id="score" bind:value={score}>
            </div>
            <div class="mb-4 last:mb-0">
                <h3 class="flex items-center justify-center mb-1">
                    <p class="text-sm font-semibold">X-Ten 개수</p>
                    <!--                    <div class="text-slate-400 ml-2 text-xs"> </div>-->
                </h3>

                <label for="xten"></label>
                <input class="config border rounded-sm p-2 w-full h-12 text-xl" name="xten" id="xten" on:focus={selectInput} bind:value={xten}>
            </div>

            <input type="submit" class="bg-white text-slate-900 border border-slate-200 shadow-xl hover:bg-gray-50 ease-in-out duration-200 rounded-md px-4 w-full" value="등록" on:click={both}>
            <input type="submit" class="bg-white text-slate-900 border border-slate-200 shadow-xl hover:bg-gray-50 ease-in-out duration-200 rounded-md px-4 w-full mt-3" value="불러오기: {tempScore}/{tempXten}" on:click={tempImport}>

            <p id="error" class="text-red-600 text-center mt-2" style="display: none">모든 정보를 입력해주세요</p>
        </div>
    </form>
    <form class="lg:basis-1/2">
        <div class="border border-slate-100 shadow-xl hover:shadow-2xl ease-in-out duration-500 rounded-md bg-white px-3 py-4 m-4 bg-opacity-70 hover:bg-opacity-100 transition-all">
            <h2 class="font-semibold text-xl text-center pb-1 mb-3 border-b border-slate-300 border-dashed">점수 불러오기</h2>
            <input type="submit" value="데이터 불러오기" class="bg-white text-slate-900 border border-slate-200 shadow-xl hover:bg-gray-50 ease-in-out duration-200 rounded-md px-4 w-full" on:click={getScore}>
            <div class="mb-4 last:mb-0 mt-5" id="getScore">
                {#each scores as score}
                    <div id="{score.id.toString()}" class="border-grey-100 border-2 m-1 rounded-xl p-1">
                        <h5>ID: {score.id}</h5>
                        <h5>이름: {score.username}</h5>
                        <h5>연락처: {score.contact}</h5>
                        <h5>점수: {score.score}</h5>
                        <h5>X-ten: {score.xten}</h5>
                    </div>
                {/each}

            </div>
        </div>
    </form>
</div>

<style lang="postcss">

</style>