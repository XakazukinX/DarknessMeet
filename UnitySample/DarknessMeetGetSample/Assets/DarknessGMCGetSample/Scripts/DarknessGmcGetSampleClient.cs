using System;
using HybridWebSocket;
using UnityEngine;

namespace DarknessGMCGetSample.Scripts
{
    public class DarknessGmcGetSampleClient : MonoBehaviour
    {
        private const string ConnectTarget = "ws://localhost:9999/ws";
        private WebSocket _wsClient;
        public static Action<byte[]> OnGetGmcMessage;

        private void Start()
        {
            _wsClient = WebSocketFactory.CreateInstance(ConnectTarget);

            _wsClient.OnOpen += () => { Debug.Log("Connected GMC server"); };

            _wsClient.OnMessage += (byte[] msg) =>
            {
                Debug.Log($"{System.Text.Encoding.UTF8.GetString(msg)}");
                OnGetGmcMessage?.Invoke(msg);
            };

            _wsClient.OnClose += (WebSocketCloseCode code) => { Debug.Log("WS closed with code: " + code.ToString()); };

            _wsClient.Connect();
        }
    }
}