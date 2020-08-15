using System;
using System.Threading;
using UnityEngine;
using UnityEngine.UI;

namespace DarknessGMCGetSample.Scripts
{
    public class DarknessGmcDisplaySample : MonoBehaviour
    {
        [SerializeField] private Text debugText;
        private SynchronizationContext _mainContext;

        private void Awake()
        {
            _mainContext = SynchronizationContext.Current;
        }

        private void OnEnable()
        {
            DarknessGmcGetSampleClient.OnGetGmcMessage += OnGetGmcMessage;
        }

        private void OnDisable()
        {
            DarknessGmcGetSampleClient.OnGetGmcMessage -= OnGetGmcMessage;
        }

        private void OnGetGmcMessage(byte[] data)
        {
            var jsonText = System.Text.Encoding.UTF8.GetString(data);
            var chatData = JsonUtility.FromJson<GmcMessage>(jsonText);

            if (chatData.type != 50)
            {
                Debug.LogError($"type {chatData.type} is not gmc chat data");
                return;
            }

            _mainContext.Post(_ => { debugText.text = chatData.contents; }, null);
        }
    }
}