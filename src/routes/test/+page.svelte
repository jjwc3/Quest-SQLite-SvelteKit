<script lang="ts">
    import { onMount } from 'svelte';

    let receivedMessages: string[] = [];
    let socket: WebSocket;

    onMount(() => {
        socket = new WebSocket('ws://127.0.0.1:8087');

        socket.onopen = () => {
            console.log('WebSocket 연결 성공');
        };

        socket.onmessage = (event) => {
            const data = event.data;
            console.log('서버로부터 메시지 수신:', data);
            receivedMessages = [...receivedMessages, data];
        };

        socket.onerror = (error) => {
            console.error('WebSocket 연결 오류:', error);
        };

        return () => {
            socket.close();
        };
    });


    // 메시지 전송
    function sendMessage() {
        const message = "SvelteKit에서 보낸 메시지";
        socket.send(message);
        console.log('서버로 메시지 전송:', message);
    }
</script>

<h1>실시간 WebSocket 통신</h1>

<button on:click={sendMessage}>메시지 전송</button>

<ul>
    {#each receivedMessages as message}
        <li>{message}</li>
    {/each}
</ul>
