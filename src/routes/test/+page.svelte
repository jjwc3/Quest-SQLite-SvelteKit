<script lang="ts">
    import { onMount } from 'svelte';
    import io from 'socket.io-client';

    let messages: string[] = [];
    let message: string = '';
    let socket: any;

    onMount(() => {
        // Socket.IO 서버에 연결
        socket = io('http://localhost:8087');

        // 연결 성공 시
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        // 메시지 수신
        socket.on('chat message', (msg: any) => {
            messages = [...messages, msg];
        });

        // 연결 해제 시
        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        return () => {
            // 컴포넌트가 파괴될 때 소켓 연결 해제
            socket.disconnect();
        };
    });

    const sendMessage = () => {
        if (message) {
            socket.emit('chat message', message);
            message = '';
        }
    };
</script>

<style>
    .messages {
        list-style: none;
        padding: 0;
    }
    .messages li {
        margin-bottom: 0.5rem;
    }
</style>

<h1>Chat</h1>
<ul class="messages">
    {#each messages as msg}
        <li>{msg}</li>
    {/each}
</ul>

<input
        type="text"
        bind:value={message}
        placeholder="Type a message..."
        on:keydown={(e) => e.key === 'Enter' && sendMessage()}
/>
<button on:click={sendMessage}>Send</button>
